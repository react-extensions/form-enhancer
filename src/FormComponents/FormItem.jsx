import React, { useContext, useCallback, useState, useMemo } from 'react';
import propTypes from 'prop-types';
import Context from './context';

function FormItem({ children, filter, name }) {
  const [value, setValue] = useState();
  const { onItemChange, depMap } = useContext(Context);
  const isFunctionChildren = typeof children === 'function';

  const changeDep = useCallback(
    subValue => {
      if (depMap[name]) {
        depMap[name].forEach(item => item.onDepChange(name, subValue));
      }
    },
    [depMap, name]
  );

  const handleValueChange = useCallback(
    (isRawChange, ...values) => {
      let subValue;

      try {
        subValue = filter(...values);
      } catch (err) {
        throw new Error(`Filter Error in Form Item named [${name}]:\n${err}`);
      }

      setValue(subValue);

      if (isRawChange) {
        changeDep(subValue);
      }

      onItemChange(name, subValue, isRawChange);
    },
    [changeDep, filter, name, onItemChange]
  );

  const handleChange = useMemo(() => handleValueChange.bind(null, true), [
    handleValueChange,
  ]);

  return isFunctionChildren
    ? children(handleChange)
    : React.cloneElement(children, {
        ...children.props,
      });
}

FormItem.defaultProps = {
  validator: () => true,
  children: undefined,
};

FormItem.propTypes = {
  onDepChange: propTypes.func,
  name: propTypes.string,
  validator: propTypes.func,
  filter: propTypes.func,
  children: propTypes.node,
  oneOf: propTypes.arrayOf(propTypes.string),
  dependence: propTypes.oneOfType([propTypes.array, propTypes.string]),
  // value:
  // defaultValue
};

export default FormItem;
