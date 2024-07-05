// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;

//     if (this._id) {
//       /**
//        * updateOne takes at least two arguments
//        * 1. filter that defines which element or document we want to update
//        * 2. specify how want to update the document
//        */

//       //  {
//       //   $set: {title: this.title} ...
//       // }

//       console.log('Update me ');

//       dbOp = db.collection('products').updateOne(
//         {
//           _id: this._id,
//         },
//         {
//           $set: this,
//         }
//       );
//     } else {
//       console.log('Save one');
//       dbOp = db.collection('products').insertOne({
//         title: this.title,
//         description: this.description,
//         price: this.price,
//         image: this.imageUrl,
//         url: this.imageUrl,
//         userId: this.userId,
//       });
//     }
//     return dbOp.then((result) => {}).catch((err) => console.log(err));
//   }

//   static fetchAll() {
//     const db = getDb();
//     // find returns a cusor which is an object
//     // provided by mongodb, which allows us to go through our document step by step
//     // because find could also return millions of document
//     // and we don't want to transfer them over the wire at once
//     // find give us an handle whic we can use to tell mongodb give me the next document and so on
//     // however there is a toArray method which tell mongodb to give us the document at once  and turn
//     // them into a javascript arry
//     // we should only use this when we are talking of hundreds or dozen of document
//     // otherwise it is better to implement pagination
//     return db
//       .collection('products')
//       .find()
//       .toArray()
//       .then((products) => {
//         // console.log(products);
//         return products;
//       })
//       .catch((err) => console.log(err));
//   }

//   static findById(prodId) {
//     const db = getDb();
//     // since find returns a cursor,
//     // we use the next to get the last document in the cursor
//     return db
//       .collection('products')
//       .find({ _id: new mongodb.ObjectId(prodId) })
//       .next()
//       .then((product) => {
//         console.log(product);
//         return product;
//       })
//       .catch((err) => console.log(err));
//   }

//   static deleteById(prodId) {
//     const db = getDb();
//     return db
//       .collection('products')
//       .deleteOne({
//         _id: new mongodb.ObjectId(prodId),
//       })
//       .then((result) => console.log('Product deleted'))
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = Product;
