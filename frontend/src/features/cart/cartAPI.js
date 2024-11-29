// cartAPI.js
import apiClient from "../common/apiClient";
import { handleApiError } from "../../utils";
import toast from "react-hot-toast";

export async function addToCart(item) {
  try {
    const response = await apiClient.post("/cart", item);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function fetchItemsByUserId() {
  try {
    const response = await apiClient.get("/cart");
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function updateCart(update) {
  try {
    const response = await apiClient.patch(`/cart/${update.id}`, update);
    toast.success(response.data.message);
    return response.data.updatedCartItem;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function deleteItemFromCart(itemId) {
  try {
    const response = await apiClient.delete(`/cart/${itemId}`);
    return { id: itemId }; // No need to parse response, just return the itemId
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function resetCart() {
  try {
    const items = await fetchItemsByUserId();
    for (let item of items) {
      await deleteItemFromCart(item.id);
    }
    return { status: "success" };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
