import React from 'react'
import Context from './context'

/**
 * @prop {function} output
 * @prop {function} input
 * @prop {function} onChange
 * @prop {function} onSubmit
 * */

class Form extends React.PureComponent {
    constructor(props) {
        super(props)

        this.submit = this.submit.bind(this)
        this.addItem = this.addItem.bind(this)
        this.validate = this.validate.bind(this)
        this.removeItem = this.removeItem.bind(this)
        this.onItemChange = this.onItemChange.bind(this)

        this.value = {}
        this.depMap = {}
        this.items = []
    }
    /**
     * @function - 添加表单项
     * @param {Form.Item} item 
     */
    addItem(item) {
        this.items.push(item)
        // 2. 解析依赖
        let depQueue = item.props.dependence
        if (depQueue && typeof depQueue === 'string') {
            depQueue = [depQueue]
        }
        if (depQueue) {
            const map = this.depMap
            depQueue.forEach(itemName => {
                if (!map[itemName]) {
                    map[itemName] = []
                }
                map[itemName].push(item)
            })
        }

    }
    removeItem(item) {
        let depQueue = item.props.dependence
        if (depQueue && typeof depQueue === 'string') {
            depQueue = [depQueue]
        }
        if(depQueue) {
            depQueue.forEach(itemName => {
                const list = this.depMap[itemName]
                list.splice(list.indexOf(item), 1)
            })
        }
        this.items.splice(this.items.indexOf(item), 1)
        delete this.depMap[item.props.name]
        delete this.value[item.props.name]
    }


    /**
     * @function-提交
     * @param {function} callback 验证通过后的回调函数
     * */
    submit(callback) {
        if (this.validate([...this.items])) {
            callback(this.value)
        }
    }
    validate(queue, isOneOf) {
        let i = 0
        let item = queue[0]
        while (item) {
            let res = item.validator()
            const oneOf = item.props.oneOf
            const subQueue = []

            if (oneOf) {
                queue = queue.filter(item => {
                    const res = oneOf.indexOf(item.props.name) === -1
                    if (!res) {
                        subQueue.push(item)
                    }
                    return res
                })
            }

            // 未通过校验，验证oneOf中的其他组件
            if (!res) {
                if (subQueue.length) {
                    if (!this.validate(subQueue, true)) {
                        item.showTip()
                        return false
                    }
                } else {
                    !isOneOf && item.showTip()
                    return false
                }
            }
            i++
            item = queue[i]
        }
        return true
    }



    /**
     * @function - 当某个表单组件change时， 执行此函数
     * @param {string} name 当前更改的表单项 name
     */
    onItemChange(name, values, needEmit = true) {

        if (this.props.output) {
            this.value = this.props.output(this.value, name, ...values)
        } else {
            this.value[name] = values[0]
        }

        needEmit && this.props.onChange(Form.format(this.value), name, ...values)
    }

    static format(obj) {
        const newQuery = {}
        let value = null
        for (let key in obj) {
            value = obj[key]

            if (
                (!value && value !== 0)
                || (Object.prototype.toString.call(value) === '[object Array]' && value.length === 0)
                || (typeof value === 'object' && Object.keys(value).length === 0)
            ) {
                continue
            }
            newQuery[key] = value
        }
        return newQuery
    }

    render() {
        return (
            <Context.Provider value={this}>
                {this.props.children}
            </Context.Provider>
        )
    }
}



Form.defaultProps = {
    // onSubmit: () => { },
    onChange: () => { }
}

export default Form