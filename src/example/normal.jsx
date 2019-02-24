import React, { Component } from 'react';
import Form from '../core'

class Normal extends Component {
    constructor(props) {
        super(props)
        this.form = React.createRef()
    }
    submit() {
        this.form.current.submit(v=>{
            console.log(v)
        })
    }
    render() {
        return (
            <div>
                <h1>普通示例：</h1>
                <div>
                    <button type='button' onClick={this.submit.bind(this)}>submit</button>
                </div>
                <Form onChange={v => console.log(v)} ref={this.form}>
                    <div>
                        input one
                    <Form.Item
                            name='one'
                            dependence={'two'}
                            onDepChange={(n, v) => v + 2}
                            validator={v => parseInt(v) > 4}
                            value=''
                        >
                            {
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
                        input two
                    <Form.Item 
                    name='two' 
                    dependence={'one'} 
                    onDepChange={(n, v) => v + 1}
                    value=""
                    >
                            {
                                (value, { onChange }, result) => {
                                    return <input value={value} onChange={e => onChange(e.target.value)} data-test={result} />
                                }
                            }
                        </Form.Item>
                    </div>
                </Form>
            </div>
        );
    }
}

export default Normal;