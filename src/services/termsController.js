import axios from "axios";
import config from "../config";

const BASE_URL = config.api.baseUrl;

const storeTerms = async (token, content) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/terms/store`,
      {
        content,
      },
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

const getTerms = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/terms/getTerms`, {
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

export { storeTerms, getTerms };
