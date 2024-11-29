const { Blog } = require("../model/Blogs");
const fs = require("fs");
const path = require("path");

// Function to handle image uploads
const handleImageUploads = (req) => {
  const { blogsThumbnail, blogsPhotos } = req.files;
  const uploadedImages = {};

  if (blogsThumbnail && blogsThumbnail.length > 0) {
    uploadedImages.thumbnail = `${process.env.BACKEND_URL}/api/v1/static/blogsThumbnail/${blogsThumbnail[0].filename}`;
  }

  if (blogsPhotos && blogsPhotos.length > 0) {
    uploadedImages.images = blogsPhotos.map(
      (img) =>
        `${process.env.BACKEND_URL}/api/v1/static/blogsPhotos/${img.filename}`
    );
  }

  return uploadedImages;
};

// Create a new blog post
exports.createBlog = async (req, res) => {
  const { published } = req.body;
  try {
    const uploadedImages = handleImageUploads(req);
    const blogData = { ...req.body, ...uploadedImages };
    if ((published && published === "true") || published === true) {
      blogData.status = "published";
    }
    const blog = new Blog(blogData);
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch all blog posts
exports.fetchAllBlogs = async (req, res) => {
  let condition = {};

  // Default condition to exclude deleted blogs for non-admin users
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  let query = Blog.find(condition);
  let totalBlogsQuery = Blog.find(condition);

  // Filtering by category
  if (req.query.category) {
    query = query.find({ category: { $in: req.query.category.split(",") } });
    totalBlogsQuery = totalBlogsQuery.find({
      category: { $in: req.query.category.split(",") },
    });
  }

  // Filtering by status
  if (req.query.status) {
    query = query.find({ status: { $in: req.query.status.split(",") } });
    totalBlogsQuery = totalBlogsQuery.find({
      status: { $in: req.query.status.split(",") },
    });
  }

  // Sorting
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  // Count total blogs
  const totalDocs = await totalBlogsQuery.countDocuments().exec();

  // Pagination
  if (req.query._page && req.query._limit) {
    const pageSize = parseInt(req.query._limit, 10);
    const page = parseInt(req.query._page, 10);
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const blogs = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(blogs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch a blog post by ID
exports.fetchBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.views += 1;
    await blog.save();

    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a blog post by ID

exports.updateBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    let uploadedImages = {};
    if (req.files?.blogsThumbnail || req.files?.blogsPhotos) {
      uploadedImages = handleImageUploads(req);
    }
    const updatedData = { ...req.body, ...uploadedImages };

    const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    // Handle deletion of old images if necessary
    if (req.body.oldImagesUrls) {
      const oldImages = JSON.parse(req.body.oldImagesUrls);
      oldImages.forEach((url) => {
        const filePath = path.join(__dirname, "..", url);
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) console.error(`Error deleting file ${url}:`, err);
          });
        }
      });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.error(error);
  }
};

// Fetch the most viewed blog posts
exports.fetchMostViewedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ views: -1 }).limit(5);
    res.status(200).json(blogs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch the latest blog posts
exports.fetchLatestBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json(blogs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a blog post by ID
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete associated images
    const imagesToDelete = [];
    if (blog.thumbnail) imagesToDelete.push(blog.thumbnail);
    if (blog.images && blog.images.length > 0)
      imagesToDelete.push(...blog.images);

    imagesToDelete.forEach((imagePath) => {
      const fullPath = path.join(__dirname, "..", imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, (err) => {
          if (err) console.error(`Error deleting file ${imagePath}:`, err);
        });
      }
    });

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
