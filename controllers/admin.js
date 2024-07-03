const mongodb = require('mongodb');
const Product = require('../models/product');

const ObjectId = mongodb.ObjectId;

// Add product page
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

// getAdminProduct
exports.getAdminProducts = (req, res, next) => {
  // get only currenltly logged in user productts
  // req.user
  //   .getProducts()
  //   .then((products) => {
  //     console.log(products);
  //     res.render('admin/products', {
  //       prods: products,
  //       pageTitle: 'Admin Products',
  //       path: '/admin/products',
  //     });
  //   })
  //   .catch((err) => console.log(err));
  Product.fetchAll()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((err) => console.log(err));
};

// Handle Product Request
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, price, description, imageUrl);

  product
    .save()
    .then((result) => {
      res.redirect('/products');
    })
    .catch((err) => console.error(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;

  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const product = new Product(
    updatedTitle,
    updatedPrice,
    updatedDesc,
    updatedImageUrl,
    prodId
  );

  product
    .save()
    .then(() => {
      res.redirect('/products');
    })
    .catch((err) => console.error(err));
};

// Edit product page
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit === 'true' ? true : false;
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }

      console.log(product);

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.error(err));

  // // edit product that related to what the current loggin user posted
  // req.user
  //   .getProducts({ where: { id: prodId } })
  //   .then((products) => {
  //     const product = products[0];
  //     if (!products) {
  //       return res.redirect('/');
  //     }

  //     console.log(product);

  //     res.render('admin/edit-product', {
  //       pageTitle: 'Edit Product',
  //       path: '/admin/edit-product',
  //       editing: editMode,
  //       product: product.dataValues,
  //     });
  //     console.log(product, 'MY PRODUCT');
  //   })
  //   .catch((err) => console.error(err));
};

// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;

//   Product.findByPk(prodId)
//     .then((product) => {
//       return product.destroy();
//     })
//     .then((result) => {
//       console.log('Product destroyed');
//       res.redirect('/products');
//     })
//     .catch((err) => console.error(err));

//   res.redirect('/admin/products');
// };
