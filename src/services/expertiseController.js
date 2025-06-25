import axios from "axios";
import config from "../config";
const BASE_URL = config.api.baseUrl;

// Create expertise
export const createExpertise = async (expertiseData, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/expertise/createExpertise`,
      expertiseData,
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

// Get expertise list
export const getExpertise = async (
  token,
  page = 1,
  perPage = 10,
  search = ""
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/expertise/getExpertiseList`,
      {
        params: {
          page,
          per_page: perPage,
          search,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update expertise
export const updateExpertise = async (expertiseId, expertiseData, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/expertise/updateExpertise/${expertiseId}`,
      expertiseData,
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

// Delete expertise
export const deleteExpertise = async (expertiseId, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/admin/expertise/deleteExpertise/${expertiseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
