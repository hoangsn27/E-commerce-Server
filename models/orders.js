const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [],
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true },
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  payment: { type: String, required: true },
  total: { type: String, required: true },
  status: { type: Number },
  date: { type: String, required: true },
});

module.exports = mongoose.model("Oder", orderSchema);
