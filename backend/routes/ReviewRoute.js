const express = require("express");
const {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
} = require("../controller/ReviewCtrl");

const { isAuth, isAdmin } = require("../services/common");

const router = express.Router();

router
  .post("/", isAuth(), createReview)
  .get("/", getAllReviews)
  .put("/:id", isAdmin, updateReview)
  .delete("/:id", isAdmin, deleteReview);

exports.router = router;
