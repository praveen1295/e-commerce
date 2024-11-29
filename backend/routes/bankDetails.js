const express = require("express");
const {
  fetchAllBankDetails,
  createBankDetails,
  updateBankDetails,
  deleteBankDetails,
  fetchBankDetailsById,
} = require("../controller/BankDetails");

const router = express.Router();

// /bank-details is already added in base path
router
  .get("/", fetchAllBankDetails) // Fetch all bank details
  .get("/:id", fetchBankDetailsById) // Fetch all bank details
  .post("/", createBankDetails) // Create new bank details
  .patch("/:id", updateBankDetails) // Update specific bank details
  .delete("/:id", deleteBankDetails); // Delete specific bank details

module.exports = router;
