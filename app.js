const path = require('path');
const { PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE } = require('./util/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const session = require("express-session");
const MongodbStore = require("connect-mongodb-session")(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = `mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}@cluster0.gfcuwq7.mongodb.net/${DATABASE}?retryWrites=true&w=majority&appName=Cluster0`;

const app = express();
const store = new MongodbStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    req.user = user;
    next();
  }).catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(MONGODB_URI)
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