import axios from "axios";
import config from "../config";

const BASE_URL = config.api.baseUrl;

// Add a new software/cloud service
export const addSoftwareCloudService = async (serviceData, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/software-cloud-service/store`,
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

// Get all software/cloud services
export const getSoftwareCloudServices = async (token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/software-cloud-service/service/index`,
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

// Update a software/cloud service
export const updateSoftwareCloudService = async (id, serviceData, token) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/admin/software-cloud-service/service/${id}`,
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

// Delete a software/cloud service
export const deleteSoftwareCloudService = async (id, serviceData, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/admin/software-cloud-service/service/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: serviceData,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
