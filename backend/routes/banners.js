const express = require("express");
const router = express.Router();
const {
  createBanner,
  fetchAllBanners,
  fetchBannerById,
  updateBanner,
  deleteBanner,
} = require("../controller/Banners");

// Base path: /banners (assuming it's already added)

router.post("/", createBanner); // Create a new banner
router.get("/", fetchAllBanners); // Fetch all banners
router.get("/:id", fetchBannerById); // Fetch a specific banner by ID
router.patch("/:id", updateBanner); // Update a specific banner by ID
router.delete("/:id", deleteBanner); // Delete a specific banner by ID

module.exports = router;
