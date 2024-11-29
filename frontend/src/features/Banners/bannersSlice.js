import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchBanners,
  fetchBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} from "./bannersAPI";

const initialState = {
  banners: [],
  totalBanners: 0,
  status: "idle",
  error: null,
  selectedBanner: null,
};

export const fetchAllBannersAsync = createAsyncThunk(
  "banners/fetchAll",
  async ({ sort, pagination }) => {
    try {
      const response = await fetchBanners(sort, pagination);
      return response;
    } catch (error) {
      console.error("Error fetching banners:", error);
      throw error;
    }
  }
);

export const fetchBannerByIdAsync = createAsyncThunk(
  "banners/fetchBannerById",
  async (id) => {
    try {
      const response = await fetchBannerById(id);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const createBannerAsync = createAsyncThunk(
  "banners/createBanner",
  async (banner) => {
    try {
      const response = await createBanner(banner);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const updateBannerAsync = createAsyncThunk(
  "banners/updateBanner",
  async ({ id, ...updateData }) => {
    try {
      const response = await updateBanner({ id, updateData });
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteBannerAsync = createAsyncThunk(
  "banners/deleteBanner",
  async (id) => {
    try {
      await deleteBanner(id);
      return id;
    } catch (error) {
      throw error;
    }
  }
);

const bannerSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {
    clearSelectedBanner: (state) => {
      state.selectedBanner = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBannersAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllBannersAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.banners = action.payload.banners;
        state.totalBanners = action.payload?.totalBanners;
      })
      .addCase(fetchAllBannersAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      })
      .addCase(fetchBannerByIdAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBannerByIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedBanner = action.payload;
      })
      .addCase(fetchBannerByIdAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      })
      .addCase(createBannerAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createBannerAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.banners.push(action.payload);
      })
      .addCase(createBannerAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      })
      .addCase(updateBannerAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateBannerAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.banners.findIndex(
          (banner) => banner.id === action.payload.id
        );
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
      })
      .addCase(updateBannerAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      })
      .addCase(deleteBannerAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteBannerAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.banners = state.banners.filter(
          (banner) => banner.id !== action.payload
        );
      })
      .addCase(deleteBannerAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      });
  },
});

export const { clearSelectedBanner } = bannerSlice.actions;

export const selectBanners = (state) => state.banners.banners;
export const selectTotalBanners = (state) => state.banners.totalBanners;
export const selectSelectedBanner = (state) => state.banners.selectedBanner;
export const selectBannerListStatus = (state) => state.banners.status;
export const selectBannerError = (state) => state.banners.error;

export default bannerSlice.reducer;
