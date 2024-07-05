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
  User.findById('668805e4880bc77690dd8ab9')
    .then((user) => {
      console.log(user);
      // new User allows to use method on the req.user
      req.user = user;
      // console.log(user);
      next();
    })
    .catch((error) => console.error(error));
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
