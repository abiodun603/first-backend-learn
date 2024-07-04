const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const mongoConnect = require('./util/database').mongoConnect;
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
  User.findById('66861a67824f9cc33562b96a')
    .then((user) => {
      req.user = user;
      console.clear();
      console.log(user);
      next();
    })
    .catch((error) => console.error(error));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.error);

mongoConnect(() => {
  // if()
  app.listen(3000);
});
