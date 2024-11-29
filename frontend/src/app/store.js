import { configureStore, combineReducers } from "@reduxjs/toolkit";
import productReducer from "../features/product/productSlice";
import reviewReducer from "../features/product/components/reviewsSlice";

import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import bankDetailsReducer from "../features/bankDetails/bankDetailsSlice";

import orderReducer from "../features/order/orderSlice";
import blogsReducer from "../features/Blogs/blogsSlice";
import bannerReducer from "../features/Banners/bannersSlice";

import userReducer from "../features/user/userSlice";
import newUserRequestReducer from "../features/admin/components/newUserRequestsSlice";
import categoriesReducer from "../features/categories/categorySlice";
import colorsReducer from "../features/color/colorSlice";

import socketReducer from "../features/socket/socketSlice";
import messagesReducer from "../features/chat/messageSlice";
import customerCareReducer from "../features/customerCare/customerCareSlice";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import CustomerCare from "../features/customerCare/CustomerCare";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  product: productReducer,
  auth: authReducer,
  cart: cartReducer,
  order: orderReducer,
  user: userReducer,
  newUserRequests: newUserRequestReducer,
  reviews: reviewReducer,
  blogs: blogsReducer,
  banners: bannerReducer,
  bankDetails: bankDetailsReducer,
  categories: categoriesReducer,
  colors: colorsReducer,
  socket: socketReducer,
  message: messagesReducer,
  customerCare: customerCareReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
