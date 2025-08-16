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
export const getModels = async (token, page = 1, search = "") => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/models/getModels`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: page,
        search: search,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get pending models
export const getPendingModels = async (token, page = 1, search = "") => {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/models/getModels/panding`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          search: search,
        },
      }
    );

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

// Update model status (for pending models)
export const updateModelStatus = async (modelData, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/models/statusUpdate`,
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

export const importModels = async (file, token) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", "admin");
  const response = await fetch(`${BASE_URL}/admin/importModels`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to import models");
  }
  return await response.json();
};
