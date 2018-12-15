import React from 'react'
import {Cell} from '@ui'
import {Input} from '../form-comps'
import Form from '@ui/form'
import Icon from '@icon'


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
                <Icon type={'shibai'} />
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
                    title={item.label ? (item.label + ':'):null}
                    titleWidth={props.titleWidth}
                    titleAlign={props.titleAlign || 'right'}
                    className={(item.cellSpace === 'inline' ? '_inline' : '')}
                    value={
                      <Form.Item
                        name={item.name}
                        required={item.required}
                        dependence={item.dependence}
                        onDepChange={item.onDepChange}
                        defaultValue={item.defaultValue}
                        // 这里要处理下
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