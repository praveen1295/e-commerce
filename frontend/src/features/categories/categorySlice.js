import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categoryAPI";

const initialState = {
  status: "idle",
  categories: [],
  totalCategories: 0,
  categoriesLoaded: false,
};

// Async thunk to fetch categories
export const fetchAllCategoriesAsync = createAsyncThunk(
  "categories/fetchAllCategories",
  async () => {
    const response = await fetchCategories();

    console.log("rrrrrrr", response);
    return response;
  }
);

// Async thunk to create a new category
export const createCategoryAsync = createAsyncThunk(
  "categories/createCategory",
  async (category) => {
    const response = await createCategory(category);
    return response;
  }
);

// Async thunk to update an existing category
export const updateCategoryAsync = createAsyncThunk(
  "categories/updateCategory",
  async (category) => {
    const response = await updateCategory(category);
    return response;
  }
);

// Async thunk to delete a category
export const deleteCategoryAsync = createAsyncThunk(
  "categories/deleteCategory",
  async (id) => {
    const response = await deleteCategory(id);
    return response;
  }
);

export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategoriesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCategoriesAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.categories = action.payload.categories;
        state.totalCategories = action.payload?.totalCategories;

        state.categoriesLoaded = true;
      })
      .addCase(fetchAllCategoriesAsync.rejected, (state) => {
        state.status = "idle";
        state.categoriesLoaded = true;
      })
      .addCase(createCategoryAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCategoryAsync.fulfilled, (state, action) => {
        state.status = "idle";
        // state.categories = action.payload;
      })
      .addCase(updateCategoryAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.categories.findIndex(
          (category) => category.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategoryAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.categories = state.categories.filter(
          (category) => category.id !== action.payload.id
        );
      });
  },
});

export const selectCategories = (state) => state.categories?.categories;
export const selectTotalCategories = (state) =>
  state?.categories?.totalCategories;
export const selectCategoryStatus = (state) => state.categories?.status;
export const selectCategoriesLoaded = (state) =>
  state.categories.categoriesLoaded;
export default categorySlice.reducer;
