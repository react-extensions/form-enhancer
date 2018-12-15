import React from 'react'
import {Cell,Input, Icon} from '@ui'
import Form from '@core'


const formPlugins = {
  'input': (options) => {
    return (value, {onChange,onBlur, onFocus}, obj) => {
      const status = obj &&obj.type
      return (
        <React.Fragment>
          <Input {...options.props} onChange={onChange} onBlur={onBlur} onFocus={onFocus} value={value} status={status}/>
          {
            obj && (
              <span className={'_input-tip ' + ('_'+status)}>
                <Icon type={'error'} />
                {obj.text}
              </span>
            )
          }
        </React.Fragment>
      )
    }
  }
}

class FormPlugin extends React.PureComponent {
  render() {
    const props = this.props
    const query = props.value
    return (
      <Form id={props.id} onChange={props.onChange} output={props.output}>
        <div className={'plugin-form'}>
          {
            props.list.map(item => (
              <Cell key={item.name}
                    title={item.label}
                    value={
                      <Form.Item
                        name={item.name}
                        required={item.required}
                        dependence={item.dependence}
                        onDepChange={item.onDepChange}
                        defaultValue={item.defaultValue}
                        value={query[item.name]}
                        validator={item.validator}
                      >
                        {formPlugins[item.type](item)}
                      </Form.Item>
                    }/>
            ))
          }
        </div>
      </Form>
    )
  }
}

FormPlugin.submit = Form.submit

export default FormPlugin