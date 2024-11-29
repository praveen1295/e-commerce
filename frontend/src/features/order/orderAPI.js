// orderAPI.js
import toast from "react-hot-toast";
import { handleApiError } from "../../utils";
import apiClient from "../common/apiClient";

export async function createOrder(order) {
  try {
    const response = await apiClient.post("/orders", order, {
      headers: { "Content-Type": "application/json" },
    });
    if (response.data) {
      toast.success("Order created successfully");
    }
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function updateOrder(order) {
  try {
    const response = await apiClient.patch(`/orders/${order.id}`, order, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function fetchLoggedInUserOrders(sort, pagination, filter) {
  try {
    let queryString = Object.entries({
      ...sort,
      ...pagination,
      ...filter,
    })
      .filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const response = await apiClient.get(`/orders/my-orders?${queryString}`);

    const totalMyOrders = parseInt(response.headers["x-total-count"], 10);

    return { myOrders: response.data, totalMyOrders };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
export async function fetchAllOrders(sort, pagination, filter) {
  try {
    let queryString = Object.entries({ ...sort, ...pagination, ...filter })
      .filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const response = await apiClient.get(`/orders?${queryString}`);
    const totalOrders = parseInt(response.headers["x-total-count"], 10);
    return { orders: response.data, totalOrders };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function fetchOrderById(orderId) {
  try {
    const response = await apiClient.get(`/orders/order?orderId=${orderId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
