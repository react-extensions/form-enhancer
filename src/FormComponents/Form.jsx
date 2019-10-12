import React, { useCallback, useState, useMemo, useRef } from 'react';
import propTypes from 'prop-types';
import Context from './context';
import usePubSub from './usePubSub';

function Form(props) {
  const { children, onChange, values } = props;
  // 用来记录当前发生改变的表单的值，这里不能使用异步的useState
  const update = useRef({});
  const [internalValues, setInternalValues] = useState({});
  const [publish, subscribe] = usePubSub();
  // 判断form是否受控
  const isUnderControll = useMemo(
    () => Object.prototype.hasOwnProperty.call(props, 'values'),
    [props]
  );

  // 添加一个表单域
  const addItem = useCallback(
    (name, item) => {
      // 订阅依赖
      const unsubscribes = item.dependence.map(depName =>
        subscribe(depName, (...subValues) => {
          // TODO: item.onDepChange 可能只是想监听变化做其他操作？
          // 并不需要返回值。如何处理？
          update.current = {
            ...update.current,
            [name]: item.onDepChange(...subValues),
          };
        })
      );
      return () => {
        // 取消订阅
        unsubscribes.forEach(unsubscribe => unsubscribe());
      };
    },
    [subscribe]
  );

  // 表单域的值发生改变
  const onItemChange = useCallback(
    (name, itemValue) => {
      update.current = { [name]: itemValue };
      // 发布，通知订阅进行更新
      publish(name, itemValue);

      if (isUnderControll) {
        onChange({ ...values, ...update.current });
      } else {
        setInternalValues(prev => {
          const newValues = {
            ...prev,
            ...update.current,
          };
          onChange(newValues);
          return newValues;
        });
      }
    },
    [isUnderControll, onChange, publish, values]
  );

  // context 传值
  const contextValue = useMemo(
    () => ({
      addItem,
      onItemChange,
      values: isUnderControll ? values : internalValues,
    }),
    [addItem, internalValues, onItemChange, isUnderControll, values]
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

Form.defaultProps = {
  children: undefined,
  onChange: () => undefined,
};

Form.propTypes = {
  children: propTypes.node,
  onChange: propTypes.func,
  // TODO: 自定义校验
  // eslint-disable-next-line
  values: propTypes.object,
};

export default Form;
