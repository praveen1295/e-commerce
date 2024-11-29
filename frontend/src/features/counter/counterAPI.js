// counterAPI.js
import { handleApiError } from "../../utils";
import apiClient from "../common/apiClient";

export async function fetchCount(amount = 1) {
  try {
    const response = await apiClient.get(`/count?amount=${amount}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}
