const mongoose = require("mongoose");
const { Schema } = mongoose;

const bankDetailsSchema = new Schema({
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  accountHolderName: { type: String, required: true },
  createdBy: { type: String, required: true },
});

const virtual = bankDetailsSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
bankDetailsSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.BankDetails = mongoose.model("BankDetails", bankDetailsSchema);
