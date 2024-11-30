const { Product } = require("../model/Product");
const fs = require("fs");
const path = require("path");
const {
  uniqueSuffix,
  photoPath,
  thumbnailPath,
} = require("../middlewares/fileUpload");
const { getReceiverSocketId } = require("../socket/socket");

exports.createProduct = async (req, res) => {
  try {
    // Check if req.body is present
    if (!req.body) {
      return res.status(400).json({ message: "No product data provided" });
    }

    const { otherDetailsDescriptionArr, relatedProducts } = req.body;
    // Log the request body for debugging

    const product = new Product(req.body);
    product.otherDetails = product.otherDetails || {};
    product.otherDetails.description = otherDetailsDescriptionArr;

    if (relatedProducts) {
      product.relatedProducts = relatedProducts
        .split(",")
        .map((item) => item.trim());
    } else {
      product.relatedProducts = [];
    }

    const {
      thumbnail: thumbnailArr,
      productPhotos: productPhotosArr,
      otherDescriptionImage: otherDescriptionImageArr,
    } = req.files;

    // Log files for debugging

    const currDate = Date.now();

    // Helper function to sanitize file names
    const sanitizeFilename = (filename) => filename.replace(/ /g, "_");

    // Extracting file paths for thumbnail
    if (thumbnailArr && thumbnailArr.length > 0) {
      product.thumbnail = `${
        process.env.BACKEND_URL
      }/api/v1/static/thumbnail/${uniqueSuffix}-${sanitizeFilename(
        thumbnailArr[0].originalname
      )}`;
    }

    // Extracting file paths for product photos
    if (productPhotosArr && productPhotosArr.length > 0) {
      product.images = productPhotosArr.map(
        (photo) =>
          `${
            process.env.BACKEND_URL
          }/api/v1/static/images/${uniqueSuffix}-${sanitizeFilename(
            photo.originalname
          )}`
      );
    }

    if (otherDescriptionImageArr && otherDescriptionImageArr.length > 0) {
      product.otherDetails.images = otherDescriptionImageArr.map(
        (photo) =>
          `${
            process.env.BACKEND_URL
          }/api/v1/static/images/${uniqueSuffix}-${sanitizeFilename(
            photo.originalname
          )}`
      );
    }

    // Calculate discount price
    // if (product.discountPercentage) {
    //   product.discountPrice = Math.round(
    //     product.price * (1 - product.discountPercentage / 100)
    //   );
    // } else {
    //   product.discountPrice = product.price;
    // }

    // Save the product
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    // Log the error for debugging
    console.error("Error saving product:", err);

    res
      .status(400)
      .json({ message: "Error saving product", error: err.message });
  }
};

exports.fetchCategoryCounts = async (req, res) => {
  try {
    let condition = {};
    if (!req.query.admin) {
      condition.deleted = { $ne: true };
    }

    const categories = req.query.category ? req.query.category.split(",") : [];

    let matchCondition = { ...condition };
    if (categories.length > 0) {
      matchCondition.category = { $in: categories };
    }

    // Aggregate to get the counts for each category
    const categoryAggregation = await Product.aggregate([
      { $match: matchCondition },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // Format the result as an object
    let categoryCounts = {};
    categoryAggregation.forEach((cat) => {
      categoryCounts[cat._id] = cat.count;
    });

    res.status(200).json(categoryCounts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// exports.fetchAllProducts = async (req, res) => {
//   // filter = {"category":["smartphone","laptops"]}
//   // sort = {_sort:"price",_order="desc"}
//   // pagination = {_page:1,_limit=10}
//   let condition = {};
//   if (!req.query.admin) {
//     condition.deleted = { $ne: true };
//   }

//   let query = Product.find(condition);
//   let totalProductsQuery = Product.find(condition);
//   if (req.query.category) {
//     const categoryArr = req.query.category.split(",");

//     if (categoryArr.includes("ALL_CATEGORIES")) {
//       // If "ALL_CATEGORIES" is included, remove any category filters
//       query = query.find(); // No specific filter applied
//       totalProductsQuery = totalProductsQuery.find({}); // No specific filter applied
//     } else {
//       // Apply filters based on provided categories
//       const categories = categoryArr.filter((cat) => cat !== "ALL_CATEGORIES");
//       query = query.find({ category: { $in: categories } });
//       totalProductsQuery = totalProductsQuery.find({
//         category: { $in: categories },
//       });
//     }
//   }

//   if (req.query.brand) {
//     query = query.find({ brand: { $in: req.query.brand.split(",") } });
//     totalProductsQuery = totalProductsQuery.find({
//       brand: { $in: req.query.brand.split(",") },
//     });
//   }
//   if (req.query._sort && req.query._order) {
//     query = query.sort({ [req.query._sort]: req.query._order });
//   }

//   const totalDocs = await totalProductsQuery.countDocuments().exec();

//   if (req.query._page && req.query._limit) {
//     const pageSize = parseInt(req.query._limit);
//     const page = parseInt(req.query._page);
//     query = query.skip(pageSize * (page - 1)).limit(pageSize);
//   }

//   try {
//     const docs = await query.exec();
//     res.set("X-Total-Count", totalDocs);
//     res.status(200).json(docs);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

exports.fetchAllProducts = async (req, res) => {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  let condition = {};
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);
  if (req.query.category) {
    const categoryArr = req.query.category.split(",");

    if (categoryArr.includes("ALL_CATEGORIES")) {
      // If "ALL_CATEGORIES" is included, remove any category filters
      query = query.find(); // No specific filter applied
      totalProductsQuery = totalProductsQuery.find({}); // No specific filter applied
    } else {
      // Apply filters based on provided categories
      const categories = categoryArr.filter((cat) => cat !== "ALL_CATEGORIES");
      query = query.find({ category: { $in: categories } });
      totalProductsQuery = totalProductsQuery.find({
        category: { $in: categories },
      });
    }
  }

  if (req.query.brand) {
    query = query.find({ brand: { $in: req.query.brand.split(",") } });
    totalProductsQuery = totalProductsQuery.find({
      brand: { $in: req.query.brand.split(",") },
    });
  }
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.countDocuments().exec();

  if (req.query._page && req.query._limit) {
    const pageSize = parseInt(req.query._limit);
    const page = parseInt(req.query._page);
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();

    // Calculate GST included discount prices
    const docsWithGst = docs.map((product) => {
      const productObj = product.toObject();
      if (product.discountPrice) {
        productObj.gstIncludedPrice = {
          regular: product.calculateGstIncludedPrice(
            product.discountPrice.regular
          ),
          gold: product.calculateGstIncludedPrice(product.discountPrice.gold),
          silver: product.calculateGstIncludedPrice(
            product.discountPrice.silver
          ),
          platinum: product.calculateGstIncludedPrice(
            product.discountPrice.platinum
          ),
        };
        productObj.gstAmount = {
          regular: product.calculateGstAmount(product.discountPrice.regular),
          gold: product.calculateGstAmount(product.discountPrice.gold),
          silver: product.calculateGstAmount(product.discountPrice.silver),
          platinum: product.calculateGstAmount(product.discountPrice.platinum),
        };
      }
      productObj.id = productObj._id.toHexString(); // Add id field
      delete productObj._id; // Remove _id field
      return productObj;
    });
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docsWithGst);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchRelatedProducts = async (req, res) => {
  const { skus } = req.query;

  try {
    if (!skus) {
      return res.status(400).json({ message: "No SKUs provided" });
    }

    const skuArray = skus.split(",").map((sku) => sku.trim());
    const relatedProducts = await Product.find({ sku: { $in: skuArray } });

    // Calculate GST included discount prices
    const relatedProductsWithGst = relatedProducts.map((product) => {
      const productObj = product.toObject();
      if (product.discountPrice) {
        productObj.gstIncludedPrice = {
          regular: product.calculateGstIncludedPrice(
            product.discountPrice.regular
          ),
          gold: product.calculateGstIncludedPrice(product.discountPrice.gold),
          silver: product.calculateGstIncludedPrice(
            product.discountPrice.silver
          ),
          platinum: product.calculateGstIncludedPrice(
            product.discountPrice.platinum
          ),
        };
        productObj.gstAmount = {
          regular: product.calculateGstAmount(product.discountPrice.regular),
          gold: product.calculateGstAmount(product.discountPrice.gold),
          silver: product.calculateGstAmount(product.discountPrice.silver),
          platinum: product.calculateGstAmount(product.discountPrice.platinum),
        };
      }
      productObj.id = productObj._id.toHexString(); // Add id field
      delete productObj._id; // Remove _id field
      return productObj;
    });

    res.status(200).json(relatedProductsWithGst);
  } catch (err) {
    console.error("Error fetching related products:", err);
    res
      .status(400)
      .json({ message: "Error fetching related products", error: err.message });
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Convert the product to a plain JavaScript object
    const productObj = product.toObject();

    // Calculate GST included discount prices
    if (product.discountPrice) {
      productObj.gstIncludedPrice = {
        regular: product.calculateGstIncludedPrice(
          product.discountPrice.regular
        ),
        gold: product.calculateGstIncludedPrice(product.discountPrice.gold),
        silver: product.calculateGstIncludedPrice(product.discountPrice.silver),
        platinum: product.calculateGstIncludedPrice(
          product.discountPrice.platinum
        ),
      };
      productObj.gstAmount = {
        regular: product.calculateGstAmount(product.discountPrice.regular),
        gold: product.calculateGstAmount(product.discountPrice.gold),
        silver: product.calculateGstAmount(product.discountPrice.silver),
        platinum: product.calculateGstAmount(product.discountPrice.platinum),
      };
    }

    productObj.id = productObj._id.toHexString(); // Add id field
    delete productObj._id; // Remove _id field

    res.status(200).json(productObj);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchBestSellers = async (req, res) => {
  try {
    const bestSellers = await Product.find().sort({ sales: -1 }).limit(8);

    // Calculate GST included discount prices
    const bestSellersWithGst = bestSellers.map((product) => {
      const productObj = product.toObject();
      if (product.discountPrice) {
        productObj.gstIncludedPrice = {
          regular: product.calculateGstIncludedPrice(
            product.discountPrice.regular
          ),
          gold: product.calculateGstIncludedPrice(product.discountPrice.gold),
          silver: product.calculateGstIncludedPrice(
            product.discountPrice.silver
          ),
          platinum: product.calculateGstIncludedPrice(
            product.discountPrice.platinum
          ),
        };
        productObj.gstAmount = {
          regular: product.calculateGstAmount(product.discountPrice.regular),
          gold: product.calculateGstAmount(product.discountPrice.gold),
          silver: product.calculateGstAmount(product.discountPrice.silver),
          platinum: product.calculateGstAmount(product.discountPrice.platinum),
        };
      }

      productObj.id = productObj._id.toHexString(); // Add id field
      delete productObj._id; // Remove _id field

      return productObj;
    });
    res.status(200).json(bestSellersWithGst);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error fetching best sellers", error: err.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "No search query provided" });
    }

    const searchQuery = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { sortDescription: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
      ],
    };

    const products = await Product.find(searchQuery);

    // Calculate GST included discount prices
    const productsWithGst = products.map((product) => {
      const productObj = product.toObject();
      if (product.discountPrice) {
        productObj.gstIncludedPrice = {
          regular: product.calculateGstIncludedPrice(
            product.discountPrice.regular
          ),
          gold: product.calculateGstIncludedPrice(product.discountPrice.gold),
          silver: product.calculateGstIncludedPrice(
            product.discountPrice.silver
          ),
          platinum: product.calculateGstIncludedPrice(
            product.discountPrice.platinum
          ),
        };

        productObj.gstAmount = {
          regular: product.calculateGstAmount(product.discountPrice.regular),
          gold: product.calculateGstAmount(product.discountPrice.gold),
          silver: product.calculateGstAmount(product.discountPrice.silver),
          platinum: product.calculateGstAmount(product.discountPrice.platinum),
        };
      }

      productObj.id = productObj._id.toHexString(); // Add id field
      delete productObj._id; // Remove _id field
      return productObj;
    });

    res.status(200).json(productsWithGst);
  } catch (err) {
    console.error("Error searching for products:", err);
    res
      .status(400)
      .json({ message: "Error searching for products", error: err.message });
  }
};

// exports.updateProduct = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const product = await Product.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     product.discountPrice = Math.round(
//       product.price * (1 - product.discountPercentage / 100)
//     );
//     const updatedProduct = await product.save();
//     res.status(200).json(updatedProduct);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  let { otherDetailsDescriptionArr, oldImagesUrls } = req.body;

  // Parse oldImagesUrls if it's a JSON string
  if (typeof oldImagesUrls === "string") {
    oldImagesUrls = JSON.parse(oldImagesUrls);
  }

  try {
    // Find the product by ID
    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Helper function to delete a file if it exists
    const deleteFileIfExists = (filePath) => {
      fs.access(filePath, fs.constants.F_OK, (accessErr) => {
        if (accessErr) {
          console.error(
            `File does not exist or cannot be accessed: ${filePath}`,
            accessErr
          );
        } else {
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error(`Error deleting file: ${filePath}`, unlinkErr);
            } else {
              console.log(`File deleted successfully: ${filePath}`);
            }
          });
        }
      });
    };

    // Delete old images if oldImagesUrls is provided
    if (oldImagesUrls && Array.isArray(oldImagesUrls)) {
      oldImagesUrls.forEach((url) => {
        const breakUrl = url.split("/");
        const folder = breakUrl[breakUrl.length - 2];
        const filename = path.basename(url);
        const imagePath = path.join(photoPath, filename);
        const thumbnailImagePath = path.join(thumbnailPath, filename);

        if (folder === "images") {
          deleteFileIfExists(imagePath);
        } else if (folder === "thumbnail") {
          deleteFileIfExists(thumbnailImagePath);
        }
      });
    }

    // Destructure and process uploaded files
    const {
      thumbnail: thumbnailArr,
      productPhotos: productPhotosArr,
      otherDescriptionImage: otherDescriptionImageArr,
    } = req.files;

    const currDate = Date.now();

    // Helper function to sanitize file names
    const sanitizeFilename = (filename) => filename.replace(/ /g, "_");

    // Construct the update object
    const updateFields = {
      ...req.body,
      otherDetails: {
        ...product.otherDetails,
        description: otherDetailsDescriptionArr,
      },
      thumbnail:
        thumbnailArr && thumbnailArr.length > 0
          ? `${
              process.env.BACKEND_URL
            }/api/v1/static/thumbnail/${uniqueSuffix}-${sanitizeFilename(
              thumbnailArr[0].originalname
            )}`
          : product.thumbnail,
      images:
        productPhotosArr && productPhotosArr.length > 0
          ? productPhotosArr.map(
              (photo) =>
                `${
                  process.env.BACKEND_URL
                }/api/v1/static/images/${uniqueSuffix}-${sanitizeFilename(
                  photo.originalname
                )}`
            )
          : product.images,
      otherDetails: {
        ...product.otherDetails,
        images:
          otherDescriptionImageArr && otherDescriptionImageArr.length > 0
            ? otherDescriptionImageArr.map(
                (photo) =>
                  `${
                    process.env.BACKEND_URL
                  }/api/v1/static/images/${uniqueSuffix}-${sanitizeFilename(
                    photo.originalname
                  )}`
              )
            : product.otherDetails.images,
      },
      discountPrice: req.body.discountPrice || product.discountPrice,
      discountPercentage:
        req.body.discountPercentage || product.discountPercentage,
    };

    // Calculate and update discount prices or percentages if necessary
    if (req.body.discountPercentage) {
      updateFields.discountPrice = {
        regular: req.body.discountPercentage.regular
          ? product.price * (1 - req.body.discountPercentage.regular / 100)
          : product.discountPrice.regular,
        gold: req.body.discountPercentage.gold
          ? product.price * (1 - req.body.discountPercentage.gold / 100)
          : product.discountPrice.gold,
        silver: req.body.discountPercentage.silver
          ? product.price * (1 - req.body.discountPercentage.silver / 100)
          : product.discountPrice.silver,
        platinum: req.body.discountPercentage.platinum
          ? product.price * (1 - req.body.discountPercentage.platinum / 100)
          : product.discountPrice.platinum,
      };
    } else if (req.body.discountPrice) {
      updateFields.discountPercentage = {
        regular: req.body.discountPrice.regular
          ? 100 - (req.body.discountPrice.regular / product.price) * 100
          : product.discountPercentage.regular,
        gold: req.body.discountPrice.gold
          ? 100 - (req.body.discountPrice.gold / product.price) * 100
          : product.discountPercentage.gold,
        silver: req.body.discountPrice.silver
          ? 100 - (req.body.discountPrice.silver / product.price) * 100
          : product.discountPercentage.silver,
        platinum: req.body.discountPrice.platinum
          ? 100 - (req.body.discountPrice.platinum / product.price) * 100
          : product.discountPercentage.platinum,
      };
    }

    // Update the product using findOneAndUpdate
    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("updatedProduct", updatedProduct);
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    // Log the error for debugging
    console.error("Error updating product:", err);

    // Respond with a 400 status code and the error
    res.status(400).json({ error: err.message });
  }
};
