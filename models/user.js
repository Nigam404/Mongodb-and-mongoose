const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");
class User {
  constructor(username, usermail, cart, id) {
    this.name = username;
    this.email = usermail;
    this._id = id;
    this.cart = cart;
  }

  save() {
    const db = getDb();
    const result = db.collection("users").insertOne(this);
  }
  addToCart(product) {
    //checking if the item is already present
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    //increasing the quantity if item present
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    }
    //adding product in cart if not present
    else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    //updating cart
    const updatedCart = {
      items: updatedCartItems,
    };

    //saving cart to db
    const db = getDb();
    db.collection("users").updateOne(
      {
        _id: new mongodb.ObjectId(this._id),
      },
      { $set: { cart: updatedCart } }
    );
  }

  static findById(userId) {
    const db = getDb();
    const result = db
      .collection("users")
      .find({ _id: new mongodb.ObjectId(userId) });

    return result;
  }
}

module.exports = User;
