import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchBankDetails,
  updateBankDetails,
  fetchBankDetailsById,
  deleteBankDetails,
  createBankDetails,
} from "./bankDetailsAPI";

const initialState = {
  bankDetails: [],
  totalBankDetails: 0,
  selectedBankDetail: null,
  status: "idle",
  error: null,
};

export const createBankDetailsAsync = createAsyncThunk(
  "blogs/createBankDetails",
  async (bank) => {
    try {
      const response = await createBankDetails(bank);
      return response;
    } catch (error) {
      throw error;
    }
  }
);
export const fetchAllBankDetailsAsync = createAsyncThunk(
  "bank/fetchAll",
  async () => {
    try {
      const response = await fetchBankDetails();
      console.log("rrrrrr", response);
      return response;
    } catch (error) {
      console.error("Error fetching bank details:", error);
      throw error;
    }
  }
);

export const fetchBankDetailByIdAsync = createAsyncThunk(
  "bank/fetchBankDetailById",
  async (id) => {
    try {
      const response = await fetchBankDetailsById(id);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const updateBankDetailAsync = createAsyncThunk(
  "bank/updateBankDetail",
  async (updateData) => {
    try {
      const response = await updateBankDetails(updateData);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteBankDetailAsync = createAsyncThunk(
  "bank/deleteBankDetail",
  async (id) => {
    try {
      await deleteBankDetails(id);
      return id;
    } catch (error) {
      throw error;
    }
  }
);

const bankSlice = createSlice({
  name: "bankDetails",
  initialState,
  reducers: {
    clearSelectedBankDetail: (state) => {
      state.selectedBankDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Bank Details
      .addCase(fetchAllBankDetailsAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllBankDetailsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.bankDetails = action.payload.bankDetails;
        state.totalBankDetails = action.payload?.totalBankDetails;
      })
      .addCase(fetchAllBankDetailsAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      })
      // Fetch Bank Detail By ID
      .addCase(fetchBankDetailByIdAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBankDetailByIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedBankDetail = action.payload;
      })
      .addCase(fetchBankDetailByIdAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      })
      // Update Bank Detail
      .addCase(updateBankDetailAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateBankDetailAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.bankDetails.findIndex(
          (detail) => detail.id === action.payload.id
        );
        if (index !== -1) {
          state.bankDetails[index] = action.payload;
        }
      })
      .addCase(updateBankDetailAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      })
      .addCase(deleteBankDetailAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteBankDetailAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.bankDetails = state.bankDetails.filter(
          (detail) => detail.id !== action.payload
        );
      })
      .addCase(deleteBankDetailAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      });
  },
});

export const { clearSelectedBankDetail } = bankSlice.actions;

export const selectBankDetails = (state) => state?.bankDetails?.bankDetails;
export const selectSelectedBankDetail = (state) =>
  state.bankDetails?.selectedBankDetail;
export const selectTotalBankDetails = (state) =>
  state?.bankDetails?.totalBankDetails;

export const selectBankDetailStatus = (state) => state.bankDetails.status;
export const selectBankDetailError = (state) => state.bankDetails.error;

export default bankSlice.reducer;
