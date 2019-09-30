import React from 'react';
import PropTypes from 'prop-types';
import Context from '../FormComponents/context';

/**
 * @component
 *
 * @prop {string} name 表单 name字段
 * @prop {any} value
 * @prop {array|string} dependence 依赖表单的name字段组成的数组， 当依赖发生变化时，
 *                                 会通知此表单， 并执行handler
 * @prop {function} onDepChange 当依赖改变时，会触发此函数
 * @prop {function} validator
 * @prop {function} filter
 * @prop {array} oneOf
 */

class FormItem extends React.PureComponent {
  constructor(props) {
    super(props);
    // ~~~~~~~~~~~~~~~~~~~~~
    // 此组件不适合使用 state
    // ~~~~~~~~~~~~~~~~~~~~~
    this.validateResult = null;
  }

  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.form.addItem(this);
  }

  componentWillUnmount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.form.removeItem(this);
  }

  /**
   * @function - 处理表单onChange事件
   *
   */
  onChange = (...values) => {
    this.changeExact(values, true);
  };

  /**
   * @function - 当该组件的依赖项发生改变, 会触发此函数,
   * @param {string} name
   * @param {array} values
   */
  onDepChange = (name, values) => {
    const fn = this.props.onDepChange;
    if (!fn) {
      throw Error(`${this.props.name}依赖于${name}，但是缺少onDepChange函数`);
    }
    this.changeExact([fn(name, ...values)]);
  };

  changeExact = (values, isRawChange = false) => {
    if (this.props.filter) {
      try {
        values[0] = this.props.filter(values[0]);
      } catch (err) {
        throw err;
      }
    }

    // 这里有时会因为filter后的值跟原值相同，又使用了pureComponent 导致不更新
    // 但是view层显示的值却是未经filte的值,  因此使用forceUpdate强制更新
    this.value = values[0];
    this.forceUpdate();
    isRawChange && this.changeDep(values);
    this.props.form.onItemChange(this.props.name, values, isRawChange);
  };

  changeDep = values => {
    const name = this.props.name;
    const depMap = this.props.form.depMap;
    if (depMap[name]) {
      depMap[name].forEach(item => item.onDepChange(name, values));
    }
  };

  /**
   * 失去焦点时进行验证
   * */
  doValidate = () => {
    this.validator();
    this.showTip();
  };

  showTip = () => {
    this.forceUpdate();
  };

  // 失去焦点时，验证一次，错误就设置错误数据
  // 如果之前是错误，下次输入的时候进行一次
  //   -- 如果成功了，隐藏错误提示，或者显示成功提示
  //   -- 如果失败了，继续显示
  validator = () => {
    let result = this.props.validator(
      this.value,
      Object.assign({}, this.props.form.value)
    );
    let boolResult = true;
    // -1 如果未返回值， 则判定为 true
    if (typeof result === 'undefined') {
      boolResult = true;
      result = true;
    }
    // -2 如果返回的是布尔值，直接返回
    else if (typeof result === 'boolean') {
      boolResult = result;
    }
    // -2 返回了除了以上的任何值，判定为false
    else {
      boolResult = false;
    }
    this.validateResult = result;
    return boolResult;
  };

  /**
   * 获取焦点时，隐藏所有类型的提示
   * */
  clearState = () => {
    // 隐藏 oneOf关系的所有表单项提示
    const oneOf = this.props.oneOf;
    if (oneOf) {
      this.props.form.items.forEach(item => {
        if (oneOf.indexOf(item.props.name) > -1) {
          item.hideTip();
        }
      });
    }
    this.hideTip();
  };

  hideTip = () => {
    if (this.validateResult === null) return;
    this.validateResult = null;
    this.forceUpdate();
  };

  render() {
    return this.props.children(
      this.value,
      {
        onChange: this.onChange,
        doValidate: this.doValidate,
        clearState: this.clearState,
      },
      this.validateResult
    );
  }
}

FormItem.defaultProps = {
  validator: () => true,
};

FormItem.propTypes = {
  onDepChange: PropTypes.func,
  dependence: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  name: PropTypes.string,
  validator: PropTypes.func,
  filter: PropTypes.func,
  oneOf: PropTypes.array,
  // value:
  // defaultValue
};

export default function FormContextConsumer(...props) {
  return (
    <Context.Consumer>
      {form => <FormItem form={form} {...props} />}
    </Context.Consumer>
  );
}
