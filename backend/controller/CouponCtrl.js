const { Coupon } = require("../model/CouponModel");

const asyncHandler = require("express-async-handler");

exports.createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = new Coupon({ ...req.body });
    const coupon = await newCoupon.save();
    // const result = await doc.populate("coupon");
    res.status(200).json({
      status: "success",
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    throw new Error(error);
  }
});

exports.getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json({
      status: "success",
      coupons,
    });
  } catch (error) {
    throw new Error(error);
  }
});

exports.updateCoupon = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const coupons = await Coupon.findByIdAndUpdate(id, req.body);
    res.status(200).json({
      status: "success",
      message: "Coupon updated successfully",
      coupons,
    });
  } catch (error) {
    throw new Error(error);
  }
});

exports.deleteCoupon = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const coupons = await Coupon.findByIdAndDelete(id, req.body);
    res.status(200).json({
      status: "success",
      message: "Coupon deleted successfully",
      coupons,
    });
  } catch (error) {
    throw new Error(error);
  }
});

exports.validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    const isExpired = coupon.expirationDate < new Date();
    const isUsedUp = coupon.used >= coupon.usageLimit;

    if (!coupon.active || isExpired || isUsedUp) {
      return res.status(400).json({ message: "Coupon is not valid" });
    }

    res
      .status(200)
      .json({ message: "Coupon is valid", discount: coupon.discount });
  } catch (error) {
    res.status(500).json({ error: "Failed to validate coupon" });
  }
};
