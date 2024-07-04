const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, userId) {
    this.username = username;
    this.email = email;
    this.cart = cart; // { item:[]}
    this._id = userId;
  }

  save() {
    const db = getDb();

    db.collection('users')
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addToCart(product) {
    // const existingCart = this.cart.items.findIndex((cp) => {
    //   cp._id === product._id;
    // });

    const db = getDb();

    const updatedProduct = {
      item: [{ productId: new ObjectId(product._id), quantity: 1 }],
    };

    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedProduct } }
      );
  }

  static findById(userId) {
    const db = getDb();

    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
