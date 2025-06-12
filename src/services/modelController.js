import axios from "axios";
import config from "../config";
const BASE_URL = config.api.baseUrl;

// Create a new model
export const createModel = async (modelData, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/models/createModel`,
      modelData,
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

// Get brands for model creation
export const getBrandsForModel = async (token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/brands/getBrandsformodel`,
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

// Get all models
export const getModels = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/models/getModels`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update a model
export const updateModel = async (modelData, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/models/updateModel`,
      modelData,
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

// Delete a model
export const deleteModel = async (modelId, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/admin/models/deleteModel/${modelId}`,
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
