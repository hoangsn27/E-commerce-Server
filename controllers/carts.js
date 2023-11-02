const User = require("../models/users");
const Product = require("../models/products");

exports.getCart = async (req, res) => {
  const userId = req.query.userId;

  try {
    const user = await User.findById(userId).populate("cart.items.productId");

    return res.json(user.cart.items);
  } catch {
    (err) => {
      console.log(err);
    };
  }
};

exports.postAddToCart = async (req, res) => {
  const idUser = req.query.idUser;
  const idProduct = req.query.idProduct;
  const quantity = req.query.count;

  // find product user want to buy:
  const product = await Product.findById(idProduct);

  // find user  :
  const user = await User.findById(idUser);

  user.addToCart(product, quantity);
  return res.json({ message: "Success" });
};

exports.postDeleteCart = async (req, res) => {
  const userId = req.query.userId;
  const productId = req.query.productId;

  const user = await User.findById(userId);

  user.removeFromCart(productId);
  return res.json({ message: "success" });
};

exports.postUpdateCart = async (req, res) => {
  const userId = req.query.userId;
  const productId = req.query.productId;
  const quantity = req.query.count;

  const user = await User.findById(userId);

  const product = await Product.findById(productId);

  user.updateQuantity(product, quantity);
};
