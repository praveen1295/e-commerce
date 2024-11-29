const mongoose = require("mongoose");
const { Schema } = mongoose;

const newUserRequestSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    request_type: {
      type: String,
      enum: ["new_signup", "role_change", "status_change"],
      default: "new_signup",
      required: true,
    },
    request_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
    seen: { type: Boolean, default: false },
    admin_notes: {
      type: String,
      default: "",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

newUserRequestSchema.index({ user: 1, request_status: 1 });

const virtual = newUserRequestSchema.virtual("id");
virtual.get(function () {
  return this._id.toHexString();
});

newUserRequestSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.NewUserRequest = mongoose.model("NewUserRequest", newUserRequestSchema);
