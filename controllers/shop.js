const Product = require('../models/product');
// const Cart = require('../models/cart');
// const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
  // we want to also fetch new Product
  // we want to also fetch new Product
  Product.fetchAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Get All Products
exports.getProducts = (req, res, next) => {
  // we want to also fetch new Product
  Product.fetchAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const proId = req.params.productId;
  Product.findById(proId)
    .then((products) => {
      console.log(products);
      res.render('shop/product-detail', {
        product: products,
        pageTitle: products.title,
        path: '/products',
      });
    })
    .catch((err) => console.log(err));

  // Product.findByPk(proId)
  //   .then((product) => {
  //     res.render('shop/product-detail', {
  //       product: product,
  //       pageTitle: product.title,
  //       path: '/products',
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

// Shop Cart
exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      console.log(products, 'PRODUCTS');
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: products,
      });
    })
    .catch((err) => console.log(err));
  // Cart.getCart((cart) => {
  //   Product.fetchAll((products) => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         (prod) => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     console.log(cartProducts);
  //     res.render('shop/cart', {
  //       pageTitle: 'Your Cart',
  //       path: '/cart',
  //       products: cartProducts,
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect('/cart');
      // console.log(result, 'result');
    });

  // let fetchedCart;
  // let newQuantity = 1;

  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     console.log(cart, 'FetchedCart');
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then((products) => {
  //     let product;

  //     if (products.length > 0) {
  //       product = products[0];
  //     }
  //     if (product) {
  //       // ---
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       console.log('i got here');
  //       return product;
  //     }
  //     console.log('i got here 1');

  //     return Product.findByPk(prodId);
  //   })
  //   .then((product) => {
  //     console.log('i got here 2');

  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .then(() => {
  //     res.redirect('/cart');
  //   })
  //   .catch((err) => console.log(err));
};

//Shop Checkout
exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err) => {
      console.log(err);
    });
};

// Shop Orders
exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      console.log(orders);
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .deleteItemFromCart(prodId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};
