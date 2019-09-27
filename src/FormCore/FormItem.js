class FormItem {
  constructor(parent, callback, filter, validator, name) {
    this.callback = callback;
    this.filter = filter;
    this.name = name;
    this.reomveFromParent = parent.addItem(this);
    this.validator = validator;
  }

  destory() {
    this.reomveFromParent();
  }

  setValue = this.handleValue.bind(this, true);

  handleValue = (rawValue, ...values) => {
    if (this.filter) {
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

  onDepChange = () => {};
}

export default FormItem;
