import React, { useCallback, useState, useMemo, useRef } from 'react';
import propTypes from 'prop-types';
import Context from './context';
import usePubSub from './usePubSub';

function Form(props) {
  const { children, onChange, values } = props;
  const update = useRef({});
  const [internalValues, setInternalValues] = useState({});
  const [publish, subscribe] = usePubSub();

  const isUnderControll = useMemo(
    () => Object.prototype.hasOwnProperty.call(props, 'values'),
    [props]
  );

  const addItem = useCallback(
    (name, item) => {
      const unsubscribes = item.dependence.map(depName =>
        subscribe(depName, (...subValues) => {
          update.current = {
            ...update.current,
            [name]: item.onDepChange(...subValues),
          };
        })
      );

      return () => {
        unsubscribes.forEach(unsubscribe => unsubscribe());
      };
    },
    [subscribe]
  );

  const onItemChange = useCallback(
    (name, itemValue) => {
      update.current = { [name]: itemValue };
      // 发布，通知订阅进行更新
      publish(name, itemValue);

      if (isUnderControll) {
        console.log(values, update.current);
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
