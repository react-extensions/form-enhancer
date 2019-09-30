import React, { useMemo, useCallback, useState } from 'react';
import { Input } from 'antd';
import Form from '../FormComponents';

function TestOne() {
  const [show, setShow] = useState(false);
  const [values, setValues] = useState({});
  const handleChange = useCallback(v => {
    console.log(v);
    setValues(v);
  }, []);

  return (
    <>
      <Form onChange={handleChange} values={values}>
        <div style={{ width: 300, display: 'flex' }}>
          <div>name:</div>
          <Form.Item name="name">
            {(value, setValue) => (
              <Input value={value} onChange={e => setValue(e.target.value)} />
            )}
          </Form.Item>
        </div>

        <div style={{ width: 300, marginTop: 20, display: 'flex' }}>
          <div>age:</div>
          <Form.Item name="age">
            {(value, setValue) => (
              <Input value={value} onChange={e => setValue(e.target.value)} />
            )}
          </Form.Item>
        </div>

        <div style={{ width: 300, marginTop: 20, display: 'flex' }}>
          <div>children age:</div>

          <Form.Item
            name="childAge"
            dependence={['age']}
            onDepChange={v => {
              setShow(!!v);
            }}
          >
            {(value, setValue) =>
              show ? (
                <Input value={value} onChange={e => setValue(e.target.value)} />
              ) : null
            }
          </Form.Item>
        </div>
      </Form>
    </>
  );
}

export default TestOne;
