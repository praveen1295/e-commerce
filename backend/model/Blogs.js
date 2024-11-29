const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    views: { type: Number, default: 0 },
    category: { type: String },
    tags: { type: [String] },
    published: { type: Boolean, default: false },
    thumbnail: { type: String },
    status: {
      type: String,
      required: true,
      enum: ["published", "draft", "deleted"],
      default: "draft",
    },
    images: { type: [String], default: [] },
    deleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

blogSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Blog = mongoose.model("Blog", blogSchema);
