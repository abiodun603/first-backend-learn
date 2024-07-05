const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: String,
          required: true,
        },
      },
    ],
  },
});

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// const ObjectId = mongodb.ObjectId;

// class User {
//   constructor(username, email, cart, userId) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart; // { item:[]}
//     this._id = userId;
//   }

//   save() {
//     const db = getDb();

//     db.collection('users')
//       .insertOne(this)
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   // ** ================== //
//   addToCart(product) {
//     console.log(this.cart.items, 'My CART LOG');
//     const existingCartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString();
//     });

//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (existingCartProductIndex >= 0) {
//       // newQuantity = this.cart.items[existingCartProductIndex].quantity + 1;
//       // updatedCartItems[existingCartProductIndex].quantity = newQuantity;

//       updatedCartItems[existingCartProductIndex].quantity += 1;
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }

//     const db = getDb();

//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     console.log(updatedCart);
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   getCart() {
//     const db = getDb();
//     // get the all of product id in the cart item
//     const productIds = this.cart.items.map((pid) => {
//       return pid.productId;
//     });

//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.items.find((item) => {
//               return item.productId.toString() === p._id.toString();
//             }).quantity,
//           };
//         });
//       });
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter((item) => {
//       return item.productId.toString() !== productId.toString();
//     });

//     const db = getDb();

//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDb();

//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.username,
//           },
//         };

//         return db.collection('orders').insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };

//         return db
//           .collection('users')
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     /**
//      * find can also accept a string
//      * in this case it pointing towards
//      * order.user._id
//      *
//      */
//     return db
//       .collection('orders')
//       .find({ 'user._id': new ObjectId(this._id) })
//       .toArray();
//   }

//   static findById(userId) {
//     const db = getDb();

//     return db
//       .collection('users')
//       .findOne({ _id: new ObjectId(userId) })
//       .then((user) => {
//         // console.log(user);
//         return user;
//       })
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = User;
