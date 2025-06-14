import axios from "axios";
import config from "../config";

const BASE_URL = config.api.baseUrl;

// Get all settings
export const getSettings = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/getSettings`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update settings
export const updateSettings = async (settingsData, token) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/admin/updateSettings`,
      settingsData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
