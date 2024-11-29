const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentMethods = {
  values: ["card", "cash", "bankTransfer"],
  message: "enum validator failed for payment Methods",
};
const orderSchema = new Schema(
  {
    items: { type: [Schema.Types.Mixed], required: true },
    totalAmount: { type: Number },
    totalItems: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentMethod: { type: String, required: true, enum: paymentMethods },
    referenceNumber: { type: String, default: "" },
    paymentStatus: { type: String, default: "pending" },
    status: {
      type: String,
      default: "pending",
      enum: [
        "pending",
        "placed",
        "confirmed",
        "dispatched",
        // "outForDelivery",
        "delivered",
        "cancelled",
        "return",
        // "returnApproved",
        // "pickup",
        "refund",
      ],
    },
    orderStages: {
      type: Array,
      default: [],
    },
    currentStage: { type: String },
    selectedAddress: { type: Schema.Types.Mixed, required: true },
    invoice: { type: String },
    logistics: {
      type: String,
    },
    trackingId: { type: String, default: "" },
    expectedDelivery: {
      type: String,
      default: "",
    },
    orderId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const virtual = orderSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Order = mongoose.model("Order", orderSchema);
