const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    company_name: {
      type: String,
      // required: true,
      default: "",
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: Buffer, required: true },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin", "owner", "supervisor"],
      default: "user",
    },
    addresses: { type: [Schema.Types.Mixed], required: true },
    name: { type: String, required: true },
    salt: { type: Buffer },
    resetPasswordToken: { type: String, default: "" },
    user_category: {
      type: String,
      default: "regular",
      enum: ["regular", "gold", "silver, platinum"],
    },
    user_status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    gst_number: { type: String },
    medical_license: { type: String },
    insurance_details: { type: String },
    health_data: { type: Schema.Types.Mixed },
    date_of_birth: { type: Date, required: true },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
  },
  { timestamps: true }
);

const virtual = userSchema.virtual("id");
virtual.get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.password; // Do not include password in the response
    delete ret.salt; // Do not include salt in the response
  },
});

userSchema.index({ email: 1 }); // Index email for faster queries
userSchema.index({ phone_number: 1 }); // Index phone number for faster queries

exports.User = mongoose.model("User", userSchema);
