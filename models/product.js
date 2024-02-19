const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");
class Product {
  constructor(title, price, imageUrl, description, id) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id;
  }

  async save() {
    const db = getDb();
    if (this._id) {
      //updating product if id is already set
      const result = await db
        .collection("products")
        .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set :this});
      console.log(result);
      return result;
    } else {
      //product is new and add it to db
      const result = await db.collection("products").insertOne(this);
      console.log(result);
      return result;
    }
  }

  static async fetchAll() {
    const db = getDb();
    const products = db.collection("products").find().toArray();
    return products;
  }

  static findById(prodId) {
    const db = getDb();
    const product = db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(prodId) }) //converting prodId to mongodb object id type
      .next();
    return product;
  }


}

module.exports = Product;
