import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "customerCare",
  initialState: {
    authUser: null,
    customerCares: null,
    selectedCustomerCare: null,
    onlineUsers: null,
  },
  reducers: {
    setCustomerCares: (state, action) => {
      state.customerCares = action.payload;
    },
    setSelectedCustomerCare: (state, action) => {
      state.selectedCustomerCare = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});
export const {
  setAuthUser,
  setCustomerCares,
  setSelectedCustomerCare,
  setOnlineUsers,
} = userSlice.actions;
export default userSlice.reducer;
