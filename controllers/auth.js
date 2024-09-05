const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    // Find the user by ID
    const user = await User.findById('6688192c9e07d70197377898'); // Assuming this ID exists in your database

    if (!user) {
      return res.redirect('/login'); // If the user is not found, redirect to login page
    }

    // Set session properties
    req.session.isLoggedIn = true;
    req.session.user = user; // Assign the fetched user document to req.session.user

    // Save the session
    await req.session.save(); // No callback, just await the promise

    // Redirect after session is saved
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the error-handling middleware
  }
};

exports.postLogout = (req, res, next) => {
  // Destroy the user's session
  req.session.destroy((err) => {
    // Log any errors that occur during session destruction
    if (err) {
      console.log(err);
      return next(err); // Pass the error to the error-handling middleware
    }

    // Redirect the user to the homepage after the session is destroyed
    res.redirect('/');
  });
};

exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
  });
};

exports.postSignup = (req, res, next) => {};
