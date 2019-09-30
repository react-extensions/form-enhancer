import React, { useContext, useCallback, useEffect } from 'react';
import propTypes from 'prop-types';
import Context from './context';

function FormItem({ children, filter, name, dependence, onDepChange }) {
  const { onItemChange, addItem, values: formValues } = useContext(Context);
  const isFunctionChildren = typeof children === 'function';

  useEffect(() => {
    return addItem(name, {
      dependence,
      onDepChange,
    });
  }, [addItem, dependence, name, onDepChange]);

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

  return isFunctionChildren
    ? children(formValues[name], handleChange)
    : React.cloneElement(children, {
        ...children.props,
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
