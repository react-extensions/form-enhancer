class FormItem {
  constructor(parent, filter, validator, name) {
    this.callback = () => undefined;
    this.filter = filter;
    this.name = name;
    this.validator = validator;
    this.parent = parent;
  }

  update = v => {
    this.callback.call(undefined, v);
  };

  subscribe = cb => {
    this.callback = cb;
  };

  setValue = (...values) => {
    const { filter, parent, name } = this;
    let subValue;
    try {
      subValue = filter(...values);
    } catch (err) {
      throw new Error(`Filter Error in Form Item named [${name}]:\n${err}`);
    }
    parent.onItemChange(name, subValue);

    this.callback.call(undefined);
  };

  validate = () =>{
    
  }

  onDepChange = () => {};
}

export default FormItem;
