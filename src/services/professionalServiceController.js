import axios from "axios";
import config from "../config";

const BASE_URL = config.api.baseUrl;

// Add a new professional service
export const addProfessionalService = async (serviceData, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/profession_service/store`,
      serviceData,
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

// Get all professional services
export const getProfessionalServices = async (token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/profession_service/service/index`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update a professional service
export const updateProfessionalService = async (id, serviceData, token) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/admin/profession_service/service/${id}`,
      serviceData,
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

// Delete a professional service
export const deleteProfessionalService = async (id, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/admin/profession_service/service/${id}`,
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
