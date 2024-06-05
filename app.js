const path = require('path');
const { PORT, DATABASE_USER, DATABASE_PASSWORD } = require('./util/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const errorController = require('./controllers/error');

// const Product = require('./models/product');
const User = require('./models/user');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  User.findById('665b168d050ca68d84bca92d')
  .then(user => {
    req.user = new User(user.name, user.email, user.cart, user._id);
    next();
  }).catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);



mongoose.connect(`mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}@cluster0.gfcuwq7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(() => {
  app.listen(PORT);
}).catch(err => {
  console.log(err);
});