import React, {
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import propTypes from 'prop-types';
import Context from './context';
import usePubSub from './usePubSub';

function validate(items, isOneOf) {
  let copyItems = [...items];
  if (!copyItems.length) {
    return false;
  }
  do {
    const { activeState, doSubmitValidate, oneOf } = copyItems.shift();
    const passed = doSubmitValidate();
    const oneOfItems = [];

    if (oneOf) {
      // 将oneOf的表单项从copyItems删除掉，并添加进oneOfItems
      copyItems = copyItems.filter(subItem => {
        const belongToOneOf = oneOf.indexOf(subItem.name) === -1;
        if (!belongToOneOf) {
          oneOfItems.push(subItem);
        }
        return belongToOneOf;
      });
    }

    if (passed) {
      // 如果当前表单项校验通过，没必要再去校验oneOf
      // eslint-disable-next-line no-continue
      continue;
    }

    // 如果当前这个表单项未通过校验，则校验其oneOf中的表单项
    if (oneOfItems.length) {
      if (!validate(oneOfItems, true)) {
        activeState();
        return false;
      }
    } else {
      if (!isOneOf) {
        activeState();
      }
      return false;
    }
  } while (copyItems.length);
  return true;
}

const Form = React.forwardRef(function Form(props, ref) {
  const { children, onChange, values, defaultValues } = props;
  const isUnderControll = useMemo(
    () => Object.prototype.hasOwnProperty.call(props, 'values'),
    [props]
  );
  // 当表单不受控时，用于保存内部的值
  const [internalValues, setInternalValues] = useState(defaultValues);
  const itemsRef = useRef({});
  // 用来记录当前发生改变的表单的值，这里不能使用异步的useState
  const updateValuesRef = useRef({});
  const [publish, subscribe] = usePubSub();

  // 添加一个表单域
  const addItem = useCallback(
    (
      name,
      {
        activeState,
        clearState,
        doSubmitValidate,
        dependence,
        onDepChange,
        oneOf,
      }
    ) => {
      itemsRef.current[name] = {
        activeState,
        clearState,
        doSubmitValidate,
        name,
        oneOf,
      };

      let depUnsubscribes;
      if (dependence.length) {
        // 订阅依赖
        depUnsubscribes = dependence.map(depName =>
          subscribe(depName, (...subValues) => {
            // TODO: item.onDepChange 可能只是想监听变化做其他操作？
            // 并不需要返回值。如何处理？
            updateValuesRef.current = {
              ...updateValuesRef.current,
              [name]: onDepChange(...subValues),
            };
          })
        );
      }
      return () => {
        if (depUnsubscribes) {
          // 取消订阅
          depUnsubscribes.forEach(unsubscribe => unsubscribe());
        }
        delete itemsRef.current[name];
      };
    },
    [subscribe]
  );

  const clearRelativeItemState = useCallback(name => {
    const items = itemsRef.current;
    const { oneOf } = items[name];
    if (!oneOf) {
      return;
    }
    oneOf.forEach(one => items[one].clearState());
  }, []);

  // 表单域的值发生改变
  const onItemChange = useCallback(
    (name, itemValue) => {
      updateValuesRef.current = { [name]: itemValue };
      // 发布，通知订阅进行更新
      publish(name, itemValue);

      if (isUnderControll) {
        onChange({ ...values, ...updateValuesRef.current });
        return;
      }

      setInternalValues(prev => {
        const newValues = { ...prev, ...updateValuesRef.current };
        onChange(newValues);
        return newValues;
      });
    },
    [isUnderControll, onChange, publish, values]
  );

  const submit = useCallback(
    cb => {
      if (!validate(Object.values(itemsRef.current))) {
        return;
      }
      //
      cb(isUnderControll ? values : internalValues);
    },
    [internalValues, isUnderControll, values]
  );

  // context 传值
  const contextValue = useMemo(
    () => ({
      addItem,
      clearRelativeItemState,
      onItemChange,
      values: isUnderControll ? values : internalValues,
    }),
    [
      addItem,
      clearRelativeItemState,
      onItemChange,
      internalValues,
      isUnderControll,
      values,
    ]
  );

  useEffect(() => {
    if (!ref) {
      return;
    }
    if (typeof ref === 'function') {
      ref({ submit });
    }
    // eslint-disable-next-line no-param-reassign
    ref.current = { submit };
  }, [ref, submit]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
});

Form.defaultProps = {
  defaultValues: {},
  children: undefined,
  onChange: () => undefined,
};

Form.propTypes = {
  children: propTypes.node,
  onChange: propTypes.func,
  // TODO: 自定义校验
  /* eslint-disable */
  values: propTypes.object,
  defaultValues: propTypes.object,
  /* eslint-enable */
};

export default Form;
