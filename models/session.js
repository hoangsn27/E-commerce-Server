const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  content: [{ isAdmin: { type: Boolean }, message: { type: String } }],
});

module.exports = mongoose.model("Session", sessionSchema);
