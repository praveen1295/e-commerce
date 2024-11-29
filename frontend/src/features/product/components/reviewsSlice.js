import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchReviews, submitReview } from "../productAPI";

const initialState = {
  reviews: [],
  status: "idle",
  currentPage: 1,
  totalPages: 1,
};

export const fetchReviewsAsync = createAsyncThunk(
  "reviews/fetchReviews",
  async ({ productId, pagination }) => {
    const { page, limit } = pagination;
    const response = await fetchReviews(productId, page, limit);
    return response;
  }
);

export const submitReviewAsync = createAsyncThunk(
  "reviews/submitReview",
  async (review) => {
    const response = await submitReview(review);
    return response;
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReviewsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.reviews = action.payload.reviews;
        state.totalPages = action.payload.totalPages; // Ensure this line is correct
      })
      .addCase(fetchReviewsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message;
      })
      .addCase(submitReviewAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitReviewAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.reviews.push(action.payload);
      })
      .addCase(submitReviewAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error?.message;
      });
  },
});

export const { setCurrentPage } = reviewsSlice.actions;

export const selectReviews = (state) => state.reviews.reviews;
export const selectReviewsStatus = (state) => state.reviews.status;
export const selectCurrentPage = (state) => state.reviews.currentPage;
export const selectTotalPages = (state) => state.reviews.totalPages;

export default reviewsSlice.reducer;
