const express = require("express");
const {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/Category");

const router = express.Router();

// Route for fetching and creating categories
router.get("/", fetchCategories).post("/", createCategory);

// Route for updating and deleting a category by ID
router.patch("/:id", updateCategory).delete("/:id", deleteCategory);

exports.router = router;
