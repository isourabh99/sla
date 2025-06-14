import axios from "axios";
import config from "../config";

const BASE_URL = config.api.baseUrl;

const getBusinessSettings = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/getSettings`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateBusinessSettings = async (token, settings) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/updateBusinessSetting`,
      settings,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getBusinessSettings, updateBusinessSettings };
