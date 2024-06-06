const path = require('path');
const { PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE } = require('./util/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const errorController = require('./controllers/error');

// const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  User.findById('66612c6630f98916224d5704')
  .then(user => {
    req.user = user;
    next();
  }).catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(`mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}@cluster0.gfcuwq7.mongodb.net/${DATABASE}?retryWrites=true&w=majority&appName=Cluster0`)
  .then((result) => {

    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "nayan",
          email: "nayan@gmail.com",
          cart: {
            items: []
          }
        });
        user.save();
      }
    })

    app.listen(PORT);
  }).catch(err => {
    console.log("Connection err ", err);
  });