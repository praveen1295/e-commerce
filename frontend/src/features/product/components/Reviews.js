import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { ITEMS_PER_PAGE } from "../../../app/constants.js";
import {
  fetchReviewsAsync,
  submitReviewAsync,
  setCurrentPage,
  selectReviews,
  selectReviewsStatus,
  selectCurrentPage,
  selectTotalPages,
} from "./reviewsSlice.js";
import Pagination from "../../common/Pagination";
import { selectUserInfo } from "../../user/userSlice.js";
import toast from "react-hot-toast";
import { useAlert } from "react-alert";

const ReviewForm = ({ productId, userId, closeReviewForm }) => {
  const alert = useAlert();
  const userInfo = useSelector(selectUserInfo);

  const dispatch = useDispatch();
  const reviews = useSelector(selectReviews);
  const status = useSelector(selectReviewsStatus);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const pagination = { page: currentPage, limit: ITEMS_PER_PAGE };
    dispatch(fetchReviewsAsync({ productId, pagination }));
  }, [dispatch, productId, currentPage]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userInfo) {
      toast.error("Please login to do review for this product.");
      alert.error("Please login to do review for this product.");

      return;
    }
    if (rating === 0 || comment.trim() === "") {
      setError("Please provide a rating and comment.");
      return;
    }
    setError("");

    const review = {
      productId,
      rating,
      comment,
      userId,
    };

    try {
      dispatch(submitReviewAsync(review));
      dispatch(
        fetchReviewsAsync({
          productId,
          pagination: { page: currentPage, limit: ITEMS_PER_PAGE },
        })
      );
      setRating(0);
      setComment("");
      closeReviewForm && closeReviewForm(false);
    } catch (error) {
      setError("Failed to submit the review. Please try again.");
    }
  };

  const handlePageChange = (pageNumber) => {
    dispatch(setCurrentPage(pageNumber));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Write a Review</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label className="block mb-2">Rating:</label>
          <ReactStars
            count={5}
            size={24}
            value={rating}
            onChange={handleRatingChange}
            activeColor="#ffd700"
            aria-label="Rating"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Comment:</label>
          <textarea
            className="w-full border rounded p-2"
            value={comment}
            onChange={handleCommentChange}
            aria-label="Comment"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit Review
        </button>
      </form>
      <h2 className="text-xl font-bold mb-4">Reviews</h2>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : (
        <ul className="mb-4">
          {reviews?.map((review, index) => (
            <li key={index} className="mb-4">
              <div className="mb-2">Rating: {review.rating}</div>
              <div>Comment: {review.comment}</div>
            </li>
          ))}
        </ul>
      )}
      <Pagination
        page={currentPage}
        setPage={setCurrentPage}
        handlePage={handlePageChange}
        totalItems={totalPages}
      />
    </div>
  );
};

export default ReviewForm;
