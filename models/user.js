const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");
class User {
  constructor(username, usermail) {
    this.name = username;
    this.email = usermail;
    this._id = id;
  }

  save() {
    const db = getDb();
    const result = db.collection("users").insertOne(this);
  }

  static findById(userId) {
    const db = getDb();
    const result = db
      .collection("users")
      .find({ _id: new mongodb.ObjectId(userId) });
  }
}
