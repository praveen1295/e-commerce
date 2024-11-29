// blogAPI.js
import apiClient from "../common/apiClient"; // Adjust path as per your project structure
import { handleApiError, generateQueryString } from "../../utils"; // Import handleApiError from utils

export async function fetchBlogs(sort, filters, pagination) {
  try {
    const queryString = generateQueryString({ ...sort, ...pagination });
    const response = await apiClient.get(`/blogs?${queryString}`);
    const totalBlogs = parseInt(response.headers["x-total-count"], 10);

    return { blogs: response.data, totalBlogs };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function fetchBlogById(id) {
  try {
    const response = await apiClient.get(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function createBlog(blog) {
  try {
    const response = await apiClient.post("/blogs", blog, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function updateBlog(update) {
  try {
    const response = await apiClient.patch(
      `/blogs/${update.id}`,
      update.formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function deleteBlog(id) {
  try {
    await apiClient.delete(`/blogs/${id}`);
    return id;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export const fetchMostViewedBlogs = async () => {
  try {
    const response = await apiClient.get("/blogs/most-viewed");
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const fetchLatestBlogs = async () => {
  try {
    const response = await apiClient.get("/blogs/latest");
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
