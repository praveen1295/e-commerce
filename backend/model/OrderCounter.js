const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderCounterSchema = new Schema({
  _id: String,
  seq: { type: Number, default: 0 },
});

exports.OrderCounter = mongoose.model("OrderCounter", orderCounterSchema);
