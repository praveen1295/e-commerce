import apiClient from "../common/apiClient";
import { handleApiError } from "../../utils";
import toast from "react-hot-toast";

// Fetch all categories
export async function fetchCategories() {
  try {
    const response = await apiClient.get("/categories");
    const totalCategories = parseInt(response.headers["x-total-count"], 10);

    return { categories: response.data, totalCategories };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// Create a new category
export async function createCategory(category) {
  try {
    const response = await apiClient.post("/categories", category);
    toast.success("Category created successfully");
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// Update an existing category
export async function updateCategory(category) {
  try {
    const response = await apiClient.patch(
      `/categories/${category.id}`,
      category
    );
    toast.success("Category updated successfully");
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// Delete a category
export async function deleteCategory(id) {
  try {
    await apiClient.delete(`/categories/${id}`);
    toast.success("Category deleted successfully");
    return { id };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
