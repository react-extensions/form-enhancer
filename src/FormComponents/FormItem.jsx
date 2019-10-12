import React, { useContext, useCallback, useEffect, useState } from 'react';
import propTypes from 'prop-types';
import Context from './context';

function FormItem({
  children,
  filter,
  name,
  dependence,
  onDepChange,
  validator,
  oneOf,
}) {
  const { onItemChange, addItem, values: formValues } = useContext(Context);
  // render children props
  const isFunctionChildren = typeof children === 'function';
  // 当前表单域的value
  const internalValue = formValues[name];
  // 校验信息
  const [validateResult, setValidateResult] = useState(null);

  useEffect(() => {
    // 添加\注销
    return addItem(name, {
      dependence,
      onDepChange,
    });
  }, [addItem, dependence, name, onDepChange]);

  // onChange
  const handleChange = useCallback(
    (...values) => {
      let subValue;

      try {
        subValue = filter(...values);
      } catch (err) {
        throw new Error(`Filter Error in Form Item named [${name}]:\n${err}`);
      }

      onItemChange(name, subValue);
    },
    [filter, name, onItemChange]
  );

  // 校验输入
  const validate = useCallback(() => {
    let result = validator(internalValue, {
      ...formValues,
    });
    let boolResult = true;
    // -1 如果未返回值， 则判定为 true
    if (typeof result === 'undefined') {
      boolResult = true;
      result = true;
    }
    // -2 如果返回的是布尔值，直接返回
    else if (typeof result === 'boolean') {
      boolResult = result;
    }
    // -2 返回了除了以上的任何值，判定为false
    else {
      boolResult = false;
    }
    setValidateResult(result);
    return boolResult;
  }, [formValues, internalValue, validator]);

  const hideTip = useCallback(() => {
    if (validateResult === null) {
      return;
    }
    setValidateResult(null);
  }, [validateResult]);

  const clearState = useCallback(() => {
    if (!oneOf) {
      hideTip();
      return;
    }
    this.props.form.items.forEach(item => {
      if (oneOf.indexOf(item.props.name) > -1) {
        item.hideTip();
      }
    });
    hideTip();
  }, [hideTip, oneOf]);

  return isFunctionChildren
    ? children(internalValue, handleChange, {
        validateResult,
        validate,
        clearState,
      })
    : React.cloneElement(children, {
        ...children.props,
        value: internalValue,
        onChange: handleChange,
        onBlur: validate,
        onFocus: clearState,
      });
}

FormItem.defaultProps = {
  dependence: [],
  children: undefined,
  filter: value => value,
  validator: () => true,
  onDepChange: () => undefined,
};

FormItem.propTypes = {
  name: propTypes.string,
  filter: propTypes.func,
  validator: propTypes.func,
  onDepChange: propTypes.func,
  children: propTypes.elementType,
  oneOf: propTypes.arrayOf(propTypes.string),
  dependence: propTypes.oneOfType([
    propTypes.arrayOf(propTypes.string),
    propTypes.string,
  ]),
  // value:
  // defaultValue
};

export default FormItem;
