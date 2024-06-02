// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('node-complete', 'root', 'nodecomplete', {
//   dialect: 'mysql',
//   host: 'localhost'
// });

// module.exports = sequelize;

const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  mongoClient.connect("mongodb+srv://nayan:nayan@cluster0.gfcuwq7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then((client) => {
      _db = client.db();
      callback();

    }).catch(error => {
      console.log(error);
      throw error
    });
};

const getDb = () => {
  if(_db){
    return _db;
  }

  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
