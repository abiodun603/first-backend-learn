const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  try {
    User.findById('6688192c9e07d70197377898') // Assuming this ID exists in your database
      .then((user) => {
        req.session.isLoggedIn = true;
        req.session = user; // Assign the fetched user document to req.user
        req.session.save((err) => {
          console.log(err);
          res.redirect('/');
        }); // Save
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {}
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
