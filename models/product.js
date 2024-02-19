const getDb = require("../util/database").getDb;
class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  async save() {
    const db = getDb();
    const result = await db.collection("products").insertOne(this);
    console.log(result);
    return result;
  }
}

module.exports = Product;
