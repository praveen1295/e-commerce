const express = require("express");
const { createPayment, verifyPayment } = require("../controller/Payment");

const router = express.Router();

// Route to create a payment
router.post("/", createPayment);

// Route to verify a payment
router.post("/verify", verifyPayment);

module.exports = {
  router,
};
