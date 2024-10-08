const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const nodemailer = require('nodemailer');
const sendgridTrasport = require('nodemailer-sendgrid-transport');

const errorController = require('./controllers/error');

const User = require('./models/user');
// const transport = nodemailer.createTransport(sendgridTrasport({
//   auth: {
//     api_user: '',
//     api_key:
//   }
// }));
const MONGODBO_URI =
  'mongodb+srv://abiodun_mastery:Testing123@cluster0.jupgc1f.mongodb.net/shop';
const app = express();
const store = new MongoDBStore({
  uri: MONGODBO_URI,
  collection: 'sessions',
});

/* 
  initialize crsf as a function,
 we can also pass the secret that is use for assigning our token,
 also for hashing them we want to store them in a cookie instead of the session which is the default
 but we want to use the session, ad the default, 
 and we also don't need to set any of the values
*/
const csrfProtection = csrf();
app.use(flash());

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorRoutes = require('./routes/error');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false, // this means that the session will not be saved on every request
    saveUninitialized: false, // ensure that no session get saved for a request, where it doesn't need to be saved
    store: store,
  })
);

app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();

  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req?.session?.user?._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

/**
 * inside of use passing isAuthenticated to all our render
 * i.e  res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      });

  we want to look for a way to tell express 
  that we have some data that show be included in every rendered view
 */

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(MONGODBO_URI)
  .then(() => app.listen(3000))
  .catch((err) => console.log(err));
