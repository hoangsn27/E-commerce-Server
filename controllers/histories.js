const Order = require("../models/orders");
const User = require("../models/users");

// get history by user Id
exports.getHistory = async (req, res) => {
  const userId = req.query.userId;

  const history = await Order.find({ userId: userId });

  res.json(history);
};

// get detail of history
exports.getDetailHistory = async (req, res) => {
  const orderId = req.query.orderId;

  const order = await Order.findById(orderId);

  res.json(order);
};
