// userAPI.js
import apiClient from "../common/apiClient";
import { handleApiError } from "../../utils"; // Import handleApiError from utils

export async function fetchLoggedInUser() {
  try {
    const response = await apiClient.get("/users/own");
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function updateUser(update) {
  try {
    const response = await apiClient.patch(`/users/${update.id}`, update, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function fetchAllUsers(
  user_category,
  user_status,
  role,
  pagination,
  sort,
  order
) {
  try {
    let queryString = Object.entries({
      ...pagination,
      ...sort,
      user_category,
      user_status,
      role,
    })
      .filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const response = await apiClient.get(`/users?${queryString}`);
    const totalUsers = parseInt(response.headers["x-total-count"], 10);

    return { users: response.data, totalUsers };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function fetchUserById(userId) {
  try {
    let queryString = Object.entries({
      userId,
    })
      .filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const response = await apiClient.get(`/users/user?${queryString}`);

    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function searchUsers(query) {
  try {
    const response = await apiClient.get(`/users/search`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
