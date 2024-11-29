// orderSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createOrder,
  fetchAllOrders,
  fetchLoggedInUserOrders,
  fetchOrderById,
  updateOrder,
} from "./orderAPI";

const initialState = {
  orders: [],
  myOrders: [],
  order: {},
  status: "idle",
  currentOrder: null,
  totalOrders: 0,
  totalMyOrders: 0,
};

export const createOrderAsync = createAsyncThunk(
  "order/createOrder",
  async (order) => {
    const response = await createOrder(order);
    return response;
  }
);

export const updateOrderAsync = createAsyncThunk(
  "order/updateOrder",
  async (order) => {
    const response = await updateOrder(order);
    return response;
  }
);

export const fetchAllOrdersAsync = createAsyncThunk(
  "order/fetchAllOrders",
  async ({ sort, pagination, filter = {} }) => {
    const response = await fetchAllOrders(sort, pagination, filter);
    return response;
  }
);

export const fetchOrderByIdAsync = createAsyncThunk(
  "order/fetchOrder",
  async ({ orderId }) => {
    const response = await fetchOrderById(orderId);
    return response;
  }
);

export const fetchLoggedInUserOrderAsync = createAsyncThunk(
  "order/fetchLoggedInUserOrders",
  async ({ sort, pagination, filter = {} }, { rejectWithValue }) => {
    try {
      const response = await fetchLoggedInUserOrders(sort, pagination, filter);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoggedInUserOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLoggedInUserOrderAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.myOrders = action.payload.myOrders;
        state.totalMyOrders = action.payload.totalMyOrders;
      })
      .addCase(fetchLoggedInUserOrderAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.orders.push(action.payload);
        state.currentOrder = action.payload;
      })
      .addCase(fetchAllOrdersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllOrdersAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.totalOrders;
      })
      .addCase(fetchOrderByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrderByIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.order = action.payload;
      })
      .addCase(updateOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );
        state.orders[index] = action.payload;
      });
  },
});

export const { resetOrder } = orderSlice.actions;
export const selectUserOrders = (state) => state.order.myOrders;
export const selectOrder = (state) => state.order.order;
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrders = (state) => state.order.orders;
export const selectTotalOrders = (state) => state.order.totalOrders;
export const selectTotalMyOrders = (state) => state.order.totalMyOrders;

export const selectStatus = (state) => state.order.status;

export default orderSlice.reducer;
