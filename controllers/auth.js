const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log(email);
  try {
    // Find the user by ID
    const user = await User.findOne({ email: email }); // Assuming this ID exists in your database

    if (!user) {
      console.log('no user found');
      return res.redirect('/login'); // If the user is not found, redirect to login page
    }

    // Compare the password
    const doMatch = await bcrypt.compare(password, user.password);

    if (doMatch) {
      // Set session properties
      req.session.isLoggedIn = true;
      req.session.user = user; // Assign the fetched user document to req.session.user

      // Save the session
      await req.session.save();

      // Redirect to homepage after successful login
      return res.redirect('/');
    } else {
      // Password did not match
      return res.redirect('/login'); // If the password is incorrect, redirect to login
    }
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

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect('/login');
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
