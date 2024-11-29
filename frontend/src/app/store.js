import { configureStore, createReducer } from "@reduxjs/toolkit";
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

import socket from "../features/socket/socketSlice";
import messages from "../features/chat/messageSlice";
// import Messages from '../features/chat/Messages';

export const store = configureStore({
  reducer: {
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
    socket: socket,
    message: messages,
  },
});
