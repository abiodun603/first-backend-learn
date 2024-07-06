const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorRoutes = require('./routes/error');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('6688192c9e07d70197377898') // Assuming this ID exists in your database
    .then((user) => {
      req.user = user; // Assign the fetched user document to req.user
      next(); // Call next() to proceed to the next middleware or route handler
    })
    .catch((error) => {
      console.error(error);
      next(error); // Pass the error to the error handling middleware
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.error);

mongoose
  .connect(
    'mongodb+srv://abiodun_mastery:Testing123@cluster0.jupgc1f.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: 'Abiodun',
          email: 'abiodun@test.com',
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
  })
  .then(() => app.listen(3000))
  .catch((err) => console.log(err));
