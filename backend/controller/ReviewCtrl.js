const { Review } = require("../model/ReviewModel");

const asyncHandler = require("express-async-handler");

exports.createReview = asyncHandler(async (req, res) => {
  try {
    const { productId, rating, comment, userId } = req.body;
    const newReview = new Review({ productId, rating, comment, userId });
    const review = await newReview.save();
    res.status(201).json({
      status: "success",
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

exports.getAllReviews = asyncHandler(async (req, res) => {
  const { productId, page = 1, limit = 10 } = req.query;

  try {
    let filter = {};
    if (productId) {
      filter = { productId };
    }

    const totalDocs = await Review.countDocuments(filter).exec();
    console.log("totalDocs", totalDocs);

    const reviews = await Review.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.set("X-Total-Count", totalDocs);
    res.status(200).json({
      status: "success",
      reviews,
      totalDocs,
    });
  } catch (error) {
    throw new Error(error);
  }
});

exports.updateReview = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReview = await Review.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedReview) {
      return res
        .status(404)
        .json({ status: "error", message: "Review not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

exports.deleteReview = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res
        .status(404)
        .json({ status: "error", message: "Review not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Review deleted successfully",
      review: deletedReview,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});
