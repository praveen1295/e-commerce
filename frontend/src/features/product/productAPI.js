import apiClient from "../common/apiClient";
import { handleApiError } from "../../utils"; // Import handleApiError from utils

export async function fetchProductById(id) {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function createProduct(product) {
  try {
    const response = await apiClient.post("/products", product, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function updateProduct(update) {
  try {
    const response = await apiClient.patch(
      `/products/${update.id}`,
      update.formData
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function getCategoryCounts(categories, admin) {
  try {
    const categoryValues = categories
      .map((category) => category.value)
      .join(",");

    let queryString = Object.entries({ category: categoryValues, admin })
      .filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const response = await apiClient.get(
      `/products/getCategoryCounts?${queryString}`
    );
    return response.data; // This will be the category counts object
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function fetchProductsByFilters(filter, sort, pagination, admin) {
  try {
    let queryString = Object.entries({
      ...filter,
      ...sort,
      ...pagination,
      admin,
    })
      .filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const response = await apiClient.get(`/products?${queryString}`);
    const totalItems = parseInt(response.headers["x-total-count"], 10);

    return { products: response.data, totalItems };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function fetchCategories() {
  try {
    const response = await apiClient.get("/categories");
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function fetchBrands() {
  try {
    const response = await apiClient.get("/brands");
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function fetchReviews(productId, page = 1, limit = 10) {
  try {
    const response = await apiClient.get(
      `/reviews?productId=${productId}&page=${page}&limit=${limit}`
    );
    const totalPages = parseInt(response.headers["x-total-count"], 10);
    return { reviews: response.data.reviews, totalPages };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function submitReview(review) {
  try {
    const response = await apiClient.post("/reviews", review);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function fetchRelatedProducts(skus, id) {
  try {
    const response = await apiClient.get(`/products/related/${id}`, {
      params: { skus },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function fetchBestSellers() {
  try {
    const response = await apiClient.get("/products/best-sellers");
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// Add the searchProducts function
export async function searchProducts(query) {
  try {
    const response = await apiClient.get(`/products/search`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
