import apiClient from "../common/apiClient"; // Adjust path as per your project structure
import { handleApiError, generateQueryString } from "../../utils"; // Import handleApiError from utils

export async function fetchBanners(sort, pagination) {
  try {
    const queryString = generateQueryString({ ...sort, ...pagination });
    const response = await apiClient.get(`/banners?${queryString}`);
    const totalBanners = parseInt(response.headers["x-total-count"], 10);

    return { banners: response.data, totalBanners };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function fetchBannerById(id) {
  try {
    const response = await apiClient.get(`/banners/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function createBanner(banner) {
  try {
    const response = await apiClient.post("/banners", banner, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function updateBanner(update) {
  try {
    const response = await apiClient.patch(
      `/banners/${update.id}`,
      update.updateData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function deleteBanner(id) {
  try {
    await apiClient.delete(`/banners/${id}`);
    return id;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
