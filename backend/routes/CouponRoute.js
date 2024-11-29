const express = require("express");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} = require("../controller/CouponCtrl");
const { isAuth, isAdmin } = require("../services/common");

const router = express.Router();
//  /products is already added in base path
router
  .post("/", isAdmin, createCoupon)
  .get("/getAllCoupons", getAllCoupons)
  .post("/validate-coupon", validateCoupon)
  .put("/:id", isAdmin, updateCoupon)
  .delete("/:id", deleteCoupon);

exports.router = router;
