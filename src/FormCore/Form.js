import FormItem from './FormItem';

class Form {
  constructor() {
    this.items = [];
  }

  addItem = item => {
    const index = this.items.push(item) - 1;
    return () => {
      this.items.splice(index, 1);
    };
  };

  createFormItem = () => {
    return new FormItem(this);
  };
}

export default Form;
