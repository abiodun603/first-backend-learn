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
    isAuthenticated: req.session.isLoggedIn,
  });
};

// getAdminProduct
exports.getAdminProducts = (req, res, next) => {
  console.log(req.session.isLoggedIn);
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
  Product.find({ userId: req.user._id })
    // .select(title price -_id)
    // .populate("userId", "name")
    .populate('userId')
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn,
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
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
    isAuthenticated: req.session.isLoggedIn,
  });

  product
    .save()
    .then((result) => {
      console.log(result);
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

  Product.findById(prodId)
    .then((product) => {
      if (product.userId !== req.user._id) {
        return res.redirect('/');
      }
      product.title = updatedTitle;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      product.price = updatedPrice;

      return product.save().then((response) => {
        console.log('Updated product');
        res.redirect('/admin/products');
      });
    })
    .catch((error) => console.log(error));
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

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      console.log('Product destroyed');
      res.redirect('/products');
    })
    .catch((err) => console.error(err));
};
