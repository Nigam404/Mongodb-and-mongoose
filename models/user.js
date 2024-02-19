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

  async getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((item) => {
      return item.productId;
    });

    const products = await db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray();

    return products.map((prod) => {
      return {
        ...prod,
        quantity: this.cart.items.find((i) => {
          return i.productId.toString() === prod._id.toString();
        }).quantity,
      };
    });
  }

  deleteItemFromCart(productId) {
    //getting all product in cart except the product to be deleted.
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });

    //saving updated list to db.
    const db = getDb();
    db.collection("users").updateOne(
      {
        _id: new mongodb.ObjectId(this._id),
      },
      { $set: { cart: { items: updatedCartItems } } }
    );
  }

  static findById(userId) {
    const db = getDb();
    const result = db
      .collection("users")
      .find({ _id: new mongodb.ObjectId(userId) });

    return result;
  }

  async addOrder() {
    const db = getDb();

    //getting items in cart
    const products = await this.getCart();

    //creating order object
    const order = {
      items: products,
      user: {
        _id: new mongodb.ObjectId(this._id),
        name: this.name,
        email: this.email,
      },
    };

    //adding cart item to order
    const result = await db.collection("orders").insertOne(order);

    //making cart empty
    this.cart = { items: [] };
    await db.collection("users").updateOne(
      {
        _id: new mongodb.ObjectId(this._id),
      },
      { $set: { cart: { items: [] } } }
    );
    return result;
  }

  getOrders() {
    const db = getDb();
    const orders = db
      .collection("orders")
      .find({ "user._id": new mongodb.ObjectId(this._id) })
      .toArray();

    return orders;
  }
}

module.exports = User;
