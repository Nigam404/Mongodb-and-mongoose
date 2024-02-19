const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://nigam:nigam404@cluster0.99k3bnv.mongodb.net/shop?retryWrites=true"
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      callback(client);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};
const getDb = () => {
  if (_db) {
    return _db;
  } else {
    throw "No Database Found!";
  }
};
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
