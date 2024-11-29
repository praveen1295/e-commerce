const express = require("express");
const router = express.Router();
const {
  createBlog,
  fetchAllBlogs,
  fetchBlogById,
  updateBlog,
  deleteBlog,
  fetchMostViewedBlogs,
  fetchLatestBlogs,
} = require("../controller/Blogs");

// Base path: /blogs (assuming it's already added)

router.post("/", createBlog); // Create a new blog post
router.get("/", fetchAllBlogs); // Fetch all blogs
router.get("/most-viewed", fetchMostViewedBlogs); // Fetch most viewed blogs
router.get("/latest", fetchLatestBlogs); // Fetch latest blogs
router.get("/:id", fetchBlogById); // Fetch a specific blog by ID
router.patch("/:id", updateBlog); // Update a specific blog by ID
router.delete("/:id", deleteBlog); // Delete a specific blog by ID

module.exports = router;
