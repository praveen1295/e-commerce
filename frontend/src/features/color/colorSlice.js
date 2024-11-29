import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchColors, createColor, updateColor, deleteColor } from "./colorAPI";

const initialState = {
  status: "idle",
  colors: [],
  totalColors: 0,
  colorsLoaded: false,
};

// Async thunk to fetch colors
export const fetchAllColorsAsync = createAsyncThunk(
  "colors/fetchAllColors",
  async () => {
    const response = await fetchColors();
    return response;
  }
);

// Async thunk to create a new color
export const createColorAsync = createAsyncThunk(
  "colors/createColor",
  async (color) => {
    const response = await createColor(color);
    return response;
  }
);

// Async thunk to update an existing color
export const updateColorAsync = createAsyncThunk(
  "colors/updateColor",
  async (color) => {
    const response = await updateColor(color);
    return response;
  }
);

// Async thunk to delete a color
export const deleteColorAsync = createAsyncThunk(
  "colors/deleteColor",
  async (id) => {
    const response = await deleteColor(id);
    return response;
  }
);

export const colorSlice = createSlice({
  name: "colors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllColorsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllColorsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.colors = action.payload.colors;
        state.totalColors = action.payload?.totalColors;
        state.colorsLoaded = true;
      })
      .addCase(fetchAllColorsAsync.rejected, (state) => {
        state.status = "idle";
        state.colorsLoaded = true;
      })
      .addCase(createColorAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createColorAsync.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(updateColorAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateColorAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.colors.findIndex(
          (color) => color.id === action.payload.id
        );
        if (index !== -1) {
          state.colors[index] = action.payload;
        }
      })
      .addCase(deleteColorAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteColorAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.colors = state.colors.filter(
          (color) => color.id !== action.payload.id
        );
      });
  },
});

export const selectColors = (state) => state.colors?.colors;
export const selectTotalColors = (state) => state?.colors?.totalColors;
export const selectColorStatus = (state) => state.colors?.status;
export const selectColorsLoaded = (state) => state.colors.colorsLoaded;
export default colorSlice.reducer;
