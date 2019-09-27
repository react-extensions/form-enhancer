import React, { Component } from 'react';
import Form from '../core';

class Normal extends Component {
  constructor(props) {
    super(props);
    this.form = React.createRef();
  }

  submit() {
    this.form.current.submit(v => {
      console.log(v);
    });
  }

  render() {
    return (
      <div>
        <h1>普通示例：</h1>
        <div>
          <button type="button" onClick={this.submit.bind(this)}>
            submit
          </button>
        </div>
        <Form onChange={v => console.log(v)} ref={this.form}>
          <div>
            <span>input one</span>
            <Form.Item
              name="one"
              dependence={'two'}
              onDepChange={(n, v) => v + 2}
              filter={v => (typeof v === 'number' ? v : '')}
              validator={v => parseInt(v) > 4}
              value=""
            >
              {(value, { onChange, doValidate, clearState }, result) => {
                return (
                  <>
                    <input
                      value={value}
                      onChange={e => onChange(e.target.value)}
                      data-test={String(result)}
                      onBlur={doValidate}
                      onFocus={clearState}
                    />
                    <span>{String(result)}</span>
                  </>
                );
              }}
            </Form.Item>
          </div>

          <div>
            <span>input two</span>
            <Form.Item name="two" value="">
              {(value, { onChange }) => {
                return (
                  <input
                    value={value}
                    onChange={e => onChange(e.target.value)}
                  />
                );
              }}
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  }
}

export default Normal;
