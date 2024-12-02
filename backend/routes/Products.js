const express = require("express");
const {
  createProduct,
  fetchAllProducts,
  fetchProductById,
  updateProduct,
  fetchCategoryCounts,
  fetchRelatedProducts,
  fetchBestSellers,
  searchProducts,
  fetchRecommendedProducts, // Import the searchProducts function
} = require("../controller/Product");
const { isAdmin } = require("../services/common");

const router = express.Router();

//  /products is already added in base path
router
  .post("/", createProduct)
  .get("/", fetchAllProducts)
  .get("/related/:id", fetchRelatedProducts)
  .get("/recommendedProducts", fetchRecommendedProducts)
  .get("/getCategoryCounts", fetchCategoryCounts)
  .get("/best-sellers", fetchBestSellers) // Add the route for best-selling products
  .get("/search", searchProducts) // Add the route for searching products
  .get("/:id", fetchProductById)
  .patch("/:id", updateProduct);

exports.router = router;
