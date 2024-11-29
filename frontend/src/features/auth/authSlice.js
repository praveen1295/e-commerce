// authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  createUser,
  signOut,
  checkAuth,
  resetPasswordRequest,
  resetPassword,
  sendOtp,
  verifyOtp,
} from "./authAPI";

const initialState = {
  loggedInUserToken: null, // this should only contain user identity => 'id'/'role'
  status: "idle",
  error: null,
  userChecked: false,
  mailSent: false,
  passwordReset: false,
  otpSent: false,
  otpVerified: false,
  resetOtp: false,
  resetOtpVerify: false,
};

export const createUserAsync = createAsyncThunk(
  "user/createUser",
  async (userData) => {
    const response = await createUser(userData);
    return response;
  }
);

export const sendOtpAsync = createAsyncThunk(
  "user/sendOtp",
  async (userData) => {
    const response = await sendOtp(userData);
    return response;
  }
);

export const verifyOtpAsync = createAsyncThunk(
  "user/verifyOtp",
  async (otpData) => {
    const response = await verifyOtp(otpData);
    return response;
  }
);

export const loginUserAsync = createAsyncThunk(
  "user/loginUser",
  async (loginInfo, { rejectWithValue }) => {
    try {
      const response = await loginUser(loginInfo);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const checkAuthAsync = createAsyncThunk("user/checkAuth", async () => {
  try {
    const response = await checkAuth();
    return response;
  } catch (error) {
    console.log(error);
  }
});

export const resetPasswordRequestAsync = createAsyncThunk(
  "user/resetPasswordRequest",
  async (email, { rejectWithValue }) => {
    try {
      const response = await resetPasswordRequest(email);
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const resetPasswordAsync = createAsyncThunk(
  "user/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await resetPassword(data);
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const signOutAsync = createAsyncThunk("user/signOut", async () => {
  const response = await signOut();
  return response;
});

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetOtp: (state) => {
      state.otpSent = false;
      state.otpVerified = false;
    },
    resetOtpVerify: (state) => {
      state.otpVerified = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUserToken = action.payload;
      })
      .addCase(loginUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUserToken = action.payload;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      .addCase(signOutAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signOutAsync.fulfilled, (state) => {
        state.status = "idle";
        state.loggedInUserToken = null;
      })
      .addCase(checkAuthAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedInUserToken = action.payload;
        state.userChecked = true;
      })
      .addCase(checkAuthAsync.rejected, (state) => {
        state.status = "idle";
        state.userChecked = true;
      })
      .addCase(resetPasswordRequestAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetPasswordRequestAsync.fulfilled, (state) => {
        state.status = "idle";
        state.mailSent = true;
      })
      .addCase(resetPasswordAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetPasswordAsync.fulfilled, (state) => {
        state.status = "idle";
        state.passwordReset = true;
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      .addCase(sendOtpAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendOtpAsync.fulfilled, (state) => {
        state.status = "idle";
        state.otpSent = true;
      })
      .addCase(sendOtpAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      .addCase(verifyOtpAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyOtpAsync.fulfilled, (state) => {
        state.status = "idle";
        state.otpVerified = true;
      })
      .addCase(verifyOtpAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });
  },
});

export const { resetOtp, resetOtpVerify } = authSlice.actions;

export const selectLoggedInUser = (state) => state.auth.loggedInUserToken;
export const selectError = (state) => state.auth.error;
export const selectUserChecked = (state) => state.auth.userChecked;
export const selectMailSent = (state) => state.auth.mailSent;
export const selectPasswordReset = (state) => state.auth.passwordReset;
export const selectOtpSent = (state) => state.auth.otpSent;
export const selectOtpVerified = (state) => state.auth.otpVerified;
export const selectAuthStatus = (state) => state.auth.status;

export default authSlice.reducer;
