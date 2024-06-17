const Cart = require('./cart');
const db = require('../util/database');

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (product) => product.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {});
      } else {
        this.id = Math.floor(Math.random() * 100).toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {});
      }
    });
  }

  // the static keyword allows us to call
  // the fectAll function on the Product class
  // without having to use the new Keyword
  static deleteById(id) {}

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {}
};
