const path = require('path');
const fs = require('fs');

const Cart = require('./cart');

// make p globally available
const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

// refactoring
const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    }
    /* 
      The content of the data/product.json is retrieved as a text
      so return it as an array, we did call JSON.parse
    */
    cb(JSON.parse(fileContent));
  });
};

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

    /**
     * // read file from the data directory
    fs.readFile(p, (err, fileContent) => {
      let products = [];

      if(!err){
        // convert json to javascript arrays or object or whatever that is in the file
        products = JSON.parse(fileContent)
      }

      // push input into products array
      products.push(this)
      // write into data directory
      // JSON.stringify convert javascript arrays to json file
      fs.writeFile(p, JSON.stringify(products), (err) => {

      })
    })
     * 
     */
  }

  // the static keyword allows us to call
  // the fectAll function on the Product class
  // without having to use the new Keyword
  static deleteById(id) {
    getProductsFromFile((products) => {
      // get product by id using find
      const product = products.find((product) => product.id === id);

      const updatedProducts = products.filter((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
    /*
    const p = path.join(
      path.dirname(process.mainModule.filename),
      "data",
      "products.json"
    );
    fs.readFile(p, (err, fileContent) => {
      if(err){
        cb([])
      }
      /
        The content of the data/product.json is retrieved as a text
        so return it as an array, we did call JSON.parse
      /
      cb(JSON.parse(fileContent))
    }) ****/
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
};
