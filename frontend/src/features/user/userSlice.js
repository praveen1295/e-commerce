import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  updateUser,
  fetchLoggedInUser,
  fetchAllUsers,
  searchUsers,
  fetchUserById,
} from "./userAPI";
import toast from "react-hot-toast";

const initialState = {
  status: "idle",
  userInfo: null,
  users: [],
  user: {},
  totalUsers: 0,
  searchUsersResults: [],
  error: null,
};

export const fetchLoggedInUserAsync = createAsyncThunk(
  "user/fetchLoggedInUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchLoggedInUser();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  "user/updateUser",
  async (update, { rejectWithValue }) => {
    try {
      const response = await updateUser(update);
      toast.success(response.message);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllUsersAsync = createAsyncThunk(
  "user/fetchAllUsers",
  async (
    { pagination, user_category, role, user_status, sort, order },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetchAllUsers(
        user_category,
        user_status,
        role,
        pagination,
        sort,
        order
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserByIdAsync = createAsyncThunk(
  "user/fetchUserById",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await fetchUserById(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchUserAsync = createAsyncThunk(
  "user/searchUsers",
  async (query) => {
    const response = await searchUsers(query);
    return response;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.user = {};
    },
    resetUserSearchResults: (state) => {
      state.searchUsersResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoggedInUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLoggedInUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.userInfo = action.payload;
      })
      .addCase(fetchLoggedInUserAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.userInfo = action.payload; // Ensure consistency
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAllUsersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllUsersAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.users = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
      })
      .addCase(fetchAllUsersAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchUserByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserByIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload;
      })
      .addCase(fetchUserByIdAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(searchUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.searchUsersResults = action.payload;
      });
  },
});

export const { clearSelectedUser, resetUserSearchResults } = userSlice.actions;

export const selectUserInfo = (state) => state.user.userInfo;
export const selectUsers = (state) => state.user.users;
export const selectUser = (state) => state.user.user;
export const selectTotalUsers = (state) => state.user.totalUsers;
export const selectUserInfoStatus = (state) => state.user.status;
export const selectUserError = (state) => state.user.error;
export const selectSearchUsersResults = (state) =>
  state.user.searchUsersResults;

export default userSlice.reducer;
