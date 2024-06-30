const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDb();
    return db
      .collection('products')
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    // find returns a cusor which is an object
    // provided by mongodb, which allows us to go through our document step by step
    // because find could also return millions of document
    // and we don't want to transfer them over the wire at once
    // find give us an handle whic we can use to tell mongodb give me the next document and so on
    // however there is a toArray method which tell mongodb to give us the document at once  and turn
    // them into a javascript arry
    // we should only use this when we are talking of hundreds or dozen of document
    // otherwise it is better to implement pagination
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
