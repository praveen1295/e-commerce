const mongoose = require("mongoose");
const { Schema } = mongoose;

// Subschemas for discounts
const DiscountSchema = new Schema({
  regular: {
    type: Number,
    required: true,
    min: [1, "Discount for regular should be at least 1%"],
    max: [99, "Discount for regular should be at most 99%"],
  },
  gold: {
    type: Number,
    required: true,
    min: [1, "Discount for gold should be at least 1%"],
    max: [99, "Discount for gold should be at most 99%"],
  },
  silver: {
    type: Number,
    required: true,
    min: [1, "Discount for silver should be at least 1%"],
    max: [99, "Discount for silver should be at most 99%"],
  },
  platinum: {
    type: Number,
    required: true,
    min: [1, "Discount for platinum should be at least 1%"],
    max: [99, "Discount for platinum should be at most 99%"],
  },
});

// Subschema for other descriptions
const OtherDetailsSchema = new Schema({
  description: { type: [String], default: [] },
  images: { type: [String], default: [] },
});

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  otherDetails: OtherDetailsSchema,
  sku: { type: String, required: true },
  price: { type: Number, required: true },
  discountPercentage: DiscountSchema,
  rating: {
    type: Number,
    min: [0, "Rating should be at least 0"],
    max: [5, "Rating should be at most 5"],
    default: 0,
  },
  stock: {
    type: Number,
    min: [0, "Stock should be at least 0"],
    default: 0,
  },
  brand: { type: String },
  category: { type: String },
  thumbnail: { type: String, required: true },
  images: { type: [String], required: true },
  colors: { type: [Schema.Types.Mixed] },
  dimensions: { type: String },
  weight: { type: String },
  sizes: { type: [Schema.Types.Mixed] },
  highlights: { type: [String] },
  discountPrice: {
    regular: { type: Number },
    gold: { type: Number },
    silver: { type: Number },
    platinum: { type: Number },
  },
  additionalInfo: { type: Object },
  relatedProducts: {
    type: Array,
    required: true,
  },
  deleted: { type: Boolean, default: false },
  sales: { type: Number, default: 0 },
  gstPercentage: {
    type: Number,
    required: true,
    min: [0, "GST percentage should be at least 0%"],
    max: [100, "GST percentage should be at most 100%"],
  },
});

// Virtual for 'id'
productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// To JSON transformation
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

// GST included amount calculator method
productSchema.methods.calculateGstIncludedPrice = function (price) {
  const gstAmount = (price * this.gstPercentage) / 100;
  return Math.ceil(price + gstAmount);
};

productSchema.methods.calculateGstAmount = function (price) {
  return (price * this.gstPercentage) / 100;
};

// Pre-save hook to calculate discount prices
// Pre-save hook to calculate discount prices and percentages
productSchema.pre("save", function (next) {
  if (this.discountPercentage) {
    if (this.discountPercentage.regular) {
      this.discountPrice.regular =
        this.price * (1 - this.discountPercentage.regular / 100);
    }
    if (this.discountPercentage.gold) {
      this.discountPrice.gold =
        this.price * (1 - this.discountPercentage.gold / 100);
    }
    if (this.discountPercentage.silver) {
      this.discountPrice.silver =
        this.price * (1 - this.discountPercentage.silver / 100);
    }
    if (this.discountPercentage.platinum) {
      this.discountPrice.platinum =
        this.price * (1 - this.discountPercentage.platinum / 100);
    }
  }

  next();
});

module.exports.Product = mongoose.model("Product", productSchema);
