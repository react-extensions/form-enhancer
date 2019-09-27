# react-form-design

#### 基于react的表单设计

### 安装及使用
`npm install @78d6/react-form`

`import Form from '@78d6/react-form'`

### 示例：

### 一、普通用法

```jsx

class Normal extends Component {
    constructor(props) {
        super(props)
        this.form = React.createRef()
    }
    submit() {
        // 调用form.submit方法后，form会调用每个表单项的validator方法
        // 当所有验证通过，则会调用回调函数
        this.form.current.submit(data => {
            ajax.post(url, data)
        })
    }
    render() {
        return (
            <div>
                <h1>普通示例：</h1>
                <div>
                    <button type='button' onClick={this.submit.bind(this)}>submit</button>
                </div>
                <Form 
                    onChange={v => console.log(v)} 
                    ref={this.form} // 获取form实例的引用以调用form.submit方法
                >
                    <div>
                        <span>input one</span>
                        <Form.Item
                            name='one' // 表单 name 值
                            value='' // 设置默认值 或 由父组件更新表单内的值
                            filter={v=>typeof v==='number'? v : ''} // 对用户输入值进行过滤
                            validator={v => parseInt(v) > 4} // 对表单value进行验证
                            /* 表单功能项 */
                            dependence={'two'} // 此表单项依赖的其他表单项的name值
                            onDepChange={(n, v) => v + 2} // 当依赖的表单项改变时触发此函数

                            oneOf={['tow']} // 当指定了oneOf，在表单提交时，只要其中一个表单项验证通过后，就算成功

                        >
                            {
                                // 通过render props 来渲染 表单项
                                // ~~~~~~~~~~~~~~~~~~~~~~~~~
                                // @param {*} value 
                                // @param {fn} onChange
                                // @param {fn} doValidate 触发验证，一般在失去焦点时进行
                                // @param {fn} clearState 清除验证的提示，一般在获取焦点时
                                // result {*} validator 验证函数的返回值，可以通过返回 类似 {text: '验证不通过'， color: 'red'}
                                //                      来渲染 提示信息
                                (value, { onChange, doValidate, clearState }, result) => {
                                    return (
                                        <React.Fragment>
                                            <input
                                                value={value}
                                                onChange={e => onChange(e.target.value)}
                                                data-test={String(result)}
                                                onBlur={doValidate}
                                                onFocus={clearState}
                                            />
                                            <span>{String(result)}</span>
                                        </React.Fragment>
                                    )
                                }
                            }
                        </Form.Item>
                    </div>
                    <div>
                        <span>input two</span>
                        <Form.Item
                            name='two'
                            value=""
                        >
                            {
                                (value, { onChange }) => {
                                    return <input value={value} onChange={e => onChange(e.target.value)} />
                                }
                            }
                        </Form.Item>
                    </div>
                </Form>
            </div>
        );
    }
}
```


### 二、究极用法

```jsx
import React from 'react'
import {Input, Cell, Icon} from 'ui库'
import Form from '@78d6/react-cli'

const formPlugins = {
  'input': (options) => {
    return (value, {onChange, doValidate, clearState}, obj) => {
      return (
        <React.Fragment>
          <Input {...options.props} onChange={onChange} onBlur={doValidate} onFocus={clearState} value={value} />
          {
            obj && (
              <span className={'_input-tip ' + ('_'+obj.type)}>
                <Icon type={'error'} />
                {obj.text}
              </span>
            )
          }
        </React.Fragment>
      )
    }
  },
  ...others
}

class FormPlugin extends React.PureComponent {
  render() {
    const props = this.props
    const value = props.value
    return (
      <Form onChange={props.onChange} output={props.output} ref={props.formRef}>
        <div className={'plugin-form'}>
          {
            props.list.map(item => (
              <Cell key={item.name}
                    title={item.label}
                    value={
                      <Form.Item
                        name={item.name}
                        dependence={item.dependence}
                        onDepChange={item.onDepChange}
                        value={value[item.name]}
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

export default FormPlugin
```
这样我们在使用的时候，只需要构造出下面这种数据，然后将其传递给上面的组件就可以
```javascript
const formList = [
    {
        // 这里的属性将传递给 Form.Item
        type: 'input',
        name: 'girlfriend',
        filter: v=> v, 
        dependence: [], // ...
        oneOf: [], // ...
        validator: (v)=>{
            if(typeof v !== 'boolean' && !v) {
                return {
                    text: '此项必填'
                }
            }
            if(v){
                return {
                    text: '单身狗不给使用',
                    type: 'error'
                }
            } else {
                return {
                    text: '通过',
                    type: 'success'
                }
            }
        },
        // validator: (v)=>{
        //     if(typeof v !== 'boolean' && !v) {
        //         message.toast('此项必填')
        //         return false
        //     }
        //     if(v){
        //         message.toast('单身狗不给使用')
        //         return false
        //     } else {
        //         message.toast('通过')
        //         return true
        //     }
        // },

        // 这里的属性将直接传递给表单组件
        props: {
            placeholder: '请。。。。'
        }
    }
]
```


### API

#### Form

|prop|说明|类型|默认值|
|---|---|---|---|
|`onChange`|每个表单项的值改变时都会触发Form的onChange事件。第一个参数是整个表单的值（以对象格式保存）；第二个，第三个参数分别是当前触发更改的表单项的name和value|`Function({name:value,...}, name, value)`|-|

##### Form实例的方法：
*通过ref获取Form实例*

- `ref.submit(callback)` 调用此方法后，form会调用每个表单项的`validator`方法当所有验证通过，则会调用回调函数
  
**TODO:**
- `ref.clearAllState` 调用此方法后清除所有表单验证的状态



#### Form.Item

|prop|说明|类型|默认值|
|---|---|---|---|
|`name`|表单 name 值|`String`|-|
|`value`|默认值 或 由父组件更新表单内的值|`*`|-|
|`filter`|对用户输入值进行过滤|`Function(oldV){return newV}`|-|
|`validator`|对用户输入值进行验证|`Function(value, formValue){...}`|`()=>true`|
|`dependence`|此表单项依赖的其他表单项的name值|`String`or`Array`|-|
|`onDepChange`|当依赖的表单项改变时触发此函数|`Function(depName,depValue){return value}`|-|
|`oneOf`|当指定了oneOf，在表单提交时，只要其中一个表单项验证通过后，就算成功|`Array`|-|

