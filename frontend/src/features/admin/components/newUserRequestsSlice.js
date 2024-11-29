import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchNewUserRequestById,
  fetchNewUserRequests,
} from "./newUserRequestAPI.js";

const initialState = {
  status: "idle",
  requests: [],
  newRequest: {},
  error: null,
};

export const fetchNewUserRequestsAsync = createAsyncThunk(
  "newUserRequests/fetchAll",
  async (
    { pagination, sort, request_type, request_status, user },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetchNewUserRequests(
        pagination,
        sort,
        request_type,
        request_status,
        user
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchNewUserRequestByIdAsync = createAsyncThunk(
  "newUserRequestById/fetch",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await fetchNewUserRequestById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const newUserRequestSlice = createSlice({
  name: "newUserRequests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewUserRequestsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNewUserRequestsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.requests = action.payload.newUserRequests;
      })
      .addCase(fetchNewUserRequestsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchNewUserRequestByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNewUserRequestByIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.newRequest = action.payload;
      })
      .addCase(fetchNewUserRequestByIdAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const selectNewUserRequests = (state) => {
  return state.newUserRequests?.requests;
};
export const selectNewUserRequest = (state) => {
  return state.newUserRequests?.newRequest;
};
export const selectNewUserRequestsStatus = (state) =>
  state.newUserRequests?.status;

export default newUserRequestSlice.reducer;
