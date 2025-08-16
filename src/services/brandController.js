import axios from "axios";
import config from "../config";
const BASE_URL = config.api.baseUrl;
// Create a new brand
export const createSLA = async (brandData, token) => {
  try {
    const formData = new FormData();
    formData.append("name", brandData.name);
    formData.append("percentage", brandData.percentage); // Ensure percentage is always sent
    if (brandData.image) {
      formData.append("image", brandData.image);
    }

    const response = await axios.post(
      `${BASE_URL}/admin/sla-type/createSlatype`,
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
    throw error.response?.data || error.message;
  }
};

// Get all brands with pagination
export const getSLA = async (token, page = 1, perPage = 10, search = "") => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/sla-type/getSlatypes`, {
      params: {
        page,
        per_page: perPage,
        search,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get brand by ID
export const getSLAById = async (token, slatype_id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/sla-type/getSlatypeById`,
      {
        params: {
          slatype_id: slatype_id,
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

// Update brand
export const updateSLA= async (brandData, token) => {
  try {
    const formData = new FormData();

    // Add each field to formData
    brandData.forEach((item) => {
      if (item.type === "file" && item.value.length > 0) {
        formData.append(item.key, item.value[0]);
      } else {
        formData.append(item.key, item.value);
      }
    });

    const response = await axios.post(
      `${BASE_URL}/admin/sla-type/updateSlatype`,
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
    throw error.response?.data || error.message;
  }
};

// Delete brand
export const deleteSLA = async (token, slatype_id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/admin/sla-type/deleteSlatype`,
      {
        params: {
          slatype_id: slatype_id,
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
