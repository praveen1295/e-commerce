import apiClient from "../common/apiClient"; // Adjust path as per your project structure
import { handleApiError } from "../../utils"; // Import handleApiError from utils

export async function createBankDetails(bank) {
  try {
    const response = await apiClient.post("/bank-details", bank);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function fetchBankDetails() {
  try {
    const response = await apiClient.get("/bank-details");
    const totalBankDetails = parseInt(response.headers["x-total-count"], 10);
    console.log("response", response);
    return { bankDetails: response.data, totalBankDetails };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function fetchBankDetailsById(id) {
  try {
    const response = await apiClient.get(`/bank-details/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function updateBankDetails(updateData) {
  try {
    const response = await apiClient.patch(
      `/bank-details/${updateData.id}`,
      updateData.data
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function deleteBankDetails(id) {
  try {
    await apiClient.delete(`/bank-details/${id}`);
    return id;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
