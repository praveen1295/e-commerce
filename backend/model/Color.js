const mongoose = require("mongoose");
const { Schema } = mongoose;

const colorSchema = new Schema({
  label: { type: String, required: true, unique: true },
  value: { type: String, required: true, unique: true },
});

const virtual = colorSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
colorSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Color = mongoose.model("Color", colorSchema);
