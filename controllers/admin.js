const Product = require('../models/product');

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
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('admin/products', {
        prods: rows,
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

  // ---- products.push({ title: req.body.title }); -----//
  // create a new object base of the Product class bluePrint
  const product = new Product(null, title, imageUrl, price, description);
  // this will use the save method we defined in the
  // Product class
  product
    .save()
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => console.error(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  console.log(prodId, updatedTitle, updatedPrice, updatedImageUrl, updatedDesc);

  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedPrice,
    updatedDesc
  );
  updatedProduct.save();

  res.redirect('/products');
};

// Edit product page
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit === 'true' ? true : false;
  const prodId = req.params.productId;
  // if (!editMode) {
  //   return redirect('/');
  // }
  Product.findById(prodId, (product) => {
    if (!product) return res.redirect('/');
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
    });
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);

  Product.deleteById(prodId);

  res.redirect('/admin/products');
};
