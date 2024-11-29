const express = require("express");
const {
  fetchColors,
  createColor,
  updateColor,
  deleteColor,
} = require("../controller/Color");

const router = express.Router();

// Route for fetching and creating colors
router.get("/", fetchColors).post("/", createColor);

// Route for updating and deleting a color by ID
router.patch("/:id", updateColor).delete("/:id", deleteColor);

exports.router = router;
