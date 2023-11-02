const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  idProduct: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  idUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fullname: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  star1: { type: String },
  star2: { type: String },
  star3: { type: String },
  star4: { type: String },
  star5: { type: String },
});
module.exports = mongoose.model("Comment", commentSchema);
