const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart : {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }],
    }
});

module.exports = mongoose.model("User", userSchema);

// const { ObjectId } = require("mongodb");
// const { getDb } = require("../util/database");

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // items : []
//     this._id = id;
//   }

//   save() {
//     const db = getDb();

//     return db.collection('users').insertOne(this)
//       .then(user => {
//         console.log("user saved")
//         return user;
//       }).catch(err => {
//         console.log(err);
//       })

//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });

//     let quantity = 1;
//     const updatedCartItem = [...this.cart.items];
//     if (cartProductIndex >= 0) {
//       quantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItem[cartProductIndex].quantity = quantity;
//     } else {
//       updatedCartItem.push({ productId: new ObjectId(product._id), quantity: 1 });
//     }
//     const updatedCart = { items: updatedCartItem };

//     const db = getDb();
//     return db.collection('users').
//       updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } })
//       .then(res => {
//         return res;
//       }).catch(err => console.log(err));
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(i => i.productId);

//     return db.collection('products').find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         return products.map(p => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(i => i.productId.toString() === p._id.toString()).quantity
//           }
//         })
//       });
//   }

//   deleteItemFromCart(prodId) {
//     const updatedCartItem = this.cart.items.filter(i => i.productId.toString() !== prodId.toString());
//     const db = getDb();
//     return db.collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItem } } }
//       )
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart().then(products => {
//       const order = {
//         items: products,
//         user: {
//           _id: new ObjectId(this._id),
//           name: this.name
//         }
//       };
//       return db.collection('orders').insertOne(order);

//     }).then(result => {
//       this.cart = { items: [] };
//       return db.collection('users').updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: [] } } }
//       )
//     });
//   }

//   getOrders(){
//     const db = getDb();
//     return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray().then(result => {
//       return result;
//     })
//   }
  
//   static findById(userId) {
//     const db = getDb();
//     return db.collection('users').find({ _id: new ObjectId(userId) }).next().then(user => {
//       return user
//     }).catch(err => {
//       console.log(err);
//     });
//   }
// }

// module.exports = User;