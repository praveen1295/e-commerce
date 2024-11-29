import apiClient from "../common/apiClient";
import { handleApiError } from "../../utils";
import toast from "react-hot-toast";

// Fetch all colors
export async function fetchColors() {
  try {
    const response = await apiClient.get("/colors");
    const totalColors = parseInt(response.headers["x-total-count"], 10);

    return { colors: response.data, totalColors };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// Create a new color
export async function createColor(color) {
  try {
    const response = await apiClient.post("/colors", color);
    toast.success("Color created successfully");
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// Update an existing color
export async function updateColor(color) {
  try {
    const response = await apiClient.patch(`/colors/${color.id}`, color);
    toast.success("Color updated successfully");
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// Delete a color
export async function deleteColor(id) {
  try {
    await apiClient.delete(`/colors/${id}`);
    toast.success("Color deleted successfully");
    return { id };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
