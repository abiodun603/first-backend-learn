const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { validationResult } = require('express-validator');

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
    },
    validationErrors: [],
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  try {
    // Find the user by ID
    const user = await User.findOne({ email: email }); // Assuming this ID exists in your database
    // console.log(user);
    if (!user) {
      console.log('no user found');
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: 'Invalid email or password.',
        oldInput: {
          email: email,
          password: password,
        },
        validationErrors: [],
      }); // If the user is not found, redirect to login page
    }

    // Compare the password
    const doMatch = await bcrypt.compare(password, user.password);
    console.log(doMatch);
    if (doMatch) {
      console;
      // Set session properties
      req.session.isLoggedIn = true;
      req.session.user = user; // Assign the fetched user document to req.session.user

      // Save the session
      await req.session.save();

      // Redirect to homepage after successful login
      return res.redirect('/');
    } else {
      req.flash('error', 'Invalid email or password. ');
      // Password did not match
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: 'Invalid email or password.',
        oldInput: {
          email: email,
          password: password,
        },
        validationErrors: [],
      }); // // If the password is incorrect, redirect to login
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
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  console.log(email, password, errors);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }
  bcrypt
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
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getReset = (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message,
  });
};

exports.postReset = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    /**
     * we generate a token here from the butter, simply by coverting the buffer to string
     * we need to pass the hex because the buffer is holding an hexadecimal values and the toStrings needs
     * to convert the hexadecimal values to normal ASCII characters.
     */
    const token = buffer.toString('hex');

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No account with tht email found');
          return res.redirect('/reset');
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;

        return user.save();
      })
      .then((result) => {
        return res.redirect(`/reset/${token}`);
        // we can send email to the user
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }

      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  console.log(newPassword, passwordToken, userId);
  // return res.redirect('/reset');
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: new Date() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 123);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;

      return resetUser.save();
    })
    .then((result) => {
      return res.redirect('/login');
    })
    .catch((err) => {
      console.error(err);
    });
};
