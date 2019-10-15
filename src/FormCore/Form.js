/* eslint-disable no-underscore-dangle */
import FormItem from './FormItem';

class Form {
  constructor() {
    this._items = [];
    this._values = {};
  }

  createItem = options => {
    const item = new FormItem(this, options);

    item.dependence.forEach();

    const index = this._items.length;
    this._items.push(item);
    return () => {
      this._items.splice(index, 1);
    };
  };

  onItemChange = v => {
    
  };

  setValues = v => {
    this._values = v;
    this.notify();
  };

  notify = () => {
    this._items.forEach(item => item.update(this._values[item.name]));
  };
}

export default Form;
