const { uniqueSuffix } = require("../middlewares/fileUpload");
const { Banner } = require("../model/Banner");

// Create a new banner
exports.createBanner = async (req, res) => {
  try {
    const { bannerImg } = req.files;

    const banner = new Banner(req.body);
    const currDate = Date.now();

    // Helper function to sanitize file names
    const sanitizeFilename = (filename) => filename.replace(/ /g, "_");

    // Extracting file paths for thumbnail
    if (bannerImg && bannerImg.length > 0) {
      banner.image = `${
        process.env.BACKEND_URL
      }/api/v1/static/banner/${uniqueSuffix}-${sanitizeFilename(
        bannerImg[0].originalname
      )}`;
    }

    await banner.save();
    res.status(201).send({ success: true, banner });
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(400).send({ error: error.message });
  }
};

// Fetch all banners

exports.fetchAllBanners = async (req, res) => {
  try {
    let query = Banner.find();

    // Count total banners
    const totalDocs = await Banner.countDocuments().exec();

    // Pagination
    if (req.query._page && req.query._limit) {
      const pageSize = parseInt(req.query._limit, 10);
      const page = parseInt(req.query._page, 10);
      if (!isNaN(pageSize) && !isNaN(page)) {
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
      }
    }

    const banners = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).send(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).send({ error: error.message });
  }
};

// Fetch a specific banner by ID
exports.fetchBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).send({ error: "Banner not found" });
    }
    res.status(200).send(banner);
  } catch (error) {
    console.error("Error fetching banner:", error);
    res.status(500).send({ error: error.message });
  }
};

// Update a specific banner by ID
exports.updateBanner = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    // const { bannerImg } = req.files;

    // if (bannerImg && bannerImg.length > 0) {
    //   const sanitizeFilename = (filename) => filename.replace(/ /g, "_");
    //   updatedData.image = `${
    //     process.env.BACKEND_URL
    //   }/api/v1/static/banner/${uniqueSuffix}-${sanitizeFilename(
    //     bannerImg[0].originalname
    //   )}`;
    // }

    const banner = await Banner.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!banner) {
      return res.status(404).send({ error: "Banner not found" });
    }
    res.status(200).send(banner);
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(400).send({ error: error.message });
  }
};

// Delete a specific banner by ID
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).send({ error: "Banner not found" });
    }
    res.status(200).send(banner);
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).send({ error: error.message });
  }
};
