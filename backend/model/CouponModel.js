const mongoose = require("mongoose");
const { Schema } = mongoose;

const couponSchema = new Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true }, // e.g., 10 for 10% off
  expirationDate: { type: Date, required: true },
  usageLimit: { type: Number, default: 1 }, // max number of times the coupon can be used
  used: { type: Number, default: 0 }, // tracks how many times the coupon has been used
  active: { type: Boolean, default: true },
  // user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  // color: { type: Schema.Types.Mixed },
});

const virtual = couponSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
couponSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Coupon = mongoose.model("Coupon", couponSchema);
