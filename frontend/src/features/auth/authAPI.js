// authAPI.js
import { handleApiError } from "../../utils";
import apiClient from "../common/apiClient";

export async function createUser(userData) {
  try {
    const response = await apiClient.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function sendOtp(userData) {
  try {
    const response = await apiClient.post("/auth/send-otp", userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function verifyOtp(otpData) {
  try {
    const response = await apiClient.post("/auth/verify-otp", otpData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function loginUser(loginInfo) {
  try {
    const response = await apiClient.post("/auth/login", loginInfo);
    return response.data;
  } catch (error) {
    handleApiError(error);
    console.error("error", error);
  }
}

export async function checkAuth() {
  try {
    const response = await apiClient.get("/auth/check");
    return response.data;
  } catch (error) {
    handleApiError(error);
    console.error("error", error);
  }
}

export async function signOut() {
  try {
    const response = await apiClient.get("/auth/logout");
    return response.data;
  } catch (error) {
    handleApiError(error);
    console.error("error", error);
  }
}

export async function resetPasswordRequest(email) {
  try {
    const response = await apiClient.post("/auth/reset-password-request", {
      email,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    console.error("error", error);
  }
}

export async function resetPassword(data) {
  try {
    const response = await apiClient.post("/auth/reset-password", data);
    return response.data;
  } catch (error) {
    handleApiError(error);
    console.error("error", error);
  }
}
