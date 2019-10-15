import React, { useContext, useCallback, useEffect, useState } from 'react';
import propTypes from 'prop-types';
import Context from './context';

/**
 * 是否验证通过
 */
function whetherValidatePass(validateResult) {
  if (typeof validateResult === 'undefined') {
    // 如果未返回值，则判定为 true
    return true;
  }

  if (typeof validateResult === 'boolean') {
    // 如果返回的是布尔值，直接返回
    return validateResult;
  }

  // 返回了除了以上的任何值，判定为false
  return false;
}

function FormItem({
  children,
  filter,
  name,
  dependence,
  onDepChange,
  validator,
  oneOf,
}) {
  const {
    // 父组件的方法
    addItem,
    clearRelativeItemState,
    onItemChange,
    // 表单的值
    values: formValues,
  } = useContext(Context);
  // render children props
  const isFunctionChildren = typeof children === 'function';
  // 当前表单域的value
  const internalValue = formValues[name];
  // 校验信息
  const [validateResult, setValidateResult] = useState(null);

  // onChange
  const handleChange = useCallback(
    (...values) => {
      let subValue;

      try {
        subValue = filter(...values);
      } catch (err) {
        throw new Error(`Filter Error in Form.Item[${name}]:\n${err}`);
      }

      onItemChange(name, subValue);
    },
    [filter, name, onItemChange]
  );

  // 校验输入
  const validate = useCallback(
    () =>
      validator(internalValue, {
        ...formValues,
      }),
    [formValues, internalValue, validator]
  );

  const doValidate = useCallback(() => {
    setValidateResult(validate());
  }, [validate]);

  // 隐藏提示信息
  const clearSelfValidateState = useCallback(() => {
    if (validateResult === null) {
      return;
    }
    setValidateResult(null);
  }, [validateResult]);

  // 清除状态
  const clearState = useCallback(() => {
    clearRelativeItemState(name);
    clearSelfValidateState();
  }, [clearRelativeItemState, clearSelfValidateState, name]);

  // effect
  useEffect(() => {
    // 添加\注销
    return addItem(name, {
      dependence: Array.isArray(dependence) ? dependence : [dependence],
      onDepChange,
      doValidate: () => whetherValidatePass(validate()),
      clearState: clearSelfValidateState,
      oneOf,
    });
  }, [
    addItem,
    clearSelfValidateState,
    dependence,
    name,
    onDepChange,
    validate,
    oneOf,
  ]);

  return isFunctionChildren
    ? children(internalValue, handleChange, {
        result: validateResult,
        doValidate,
        clearState,
      })
    : React.cloneElement(children, {
        ...children.props,
        value: internalValue,
        onChange: handleChange,
        onBlur: doValidate,
        onFocus: clearState,
      });
}

FormItem.defaultProps = {
  dependence: [],
  children: undefined,
  filter: value => value,
  validator: () => true,
  onDepChange: () => undefined,
  oneOf: undefined,
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
};

export default FormItem;
