const express = require("express");
const {
  createOrder,
  fetchOrdersByUser,
  deleteOrder,
  updateOrder,
  fetchAllOrders,
  downloadInvoice,
  downloadPackingSlip,
  fetchOrderById,
} = require("../controller/Order");

const router = express.Router();
//  /orders is already added in base path
router
  .post("/", createOrder)
  .post("/invoice-download", downloadInvoice)
  .post("/packing-slip-download", downloadPackingSlip)
  .get("/my-orders/", fetchOrdersByUser)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder)
  .get("/order", fetchOrderById)
  .get("/", fetchAllOrders);

exports.router = router;
