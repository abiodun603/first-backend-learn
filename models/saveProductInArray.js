const products = [];

module.exports  = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    products.push(this);
  }

  // the static k eyword allows us to call
  // the fectAll function on the Product class
  // without having to use the new Keyword
  static fetchAll(){
    return products
  }
}