import axios from "axios";
import config from "../config";

const BASE_URL = config.api.baseUrl;

export async function login(email, password) {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/login`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("API request failed");
  }
}

export async function getAdminProfile(token) {
  try {
    const response = await axios.get(`${BASE_URL}/admin/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch admin profile");
  }
}

export async function updateProfile(token, formData) {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/updateProfile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
}

export async function changePassword(token, currentPassword, newPassword) {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/changePassword`,
      {
        current_password: currentPassword,
        password: newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update password"
    );
  }
}
