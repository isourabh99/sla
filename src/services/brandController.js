import axios from "axios";
import config from "../config";
const BASE_URL = config.api.baseUrl;
// Create a new brand
export const createBrand = async (brandData, token) => {
  try {
    const formData = new FormData();
    formData.append("name", brandData.name);
    if (brandData.image) {
      formData.append("image", brandData.image);
    }

    const response = await axios.post(
      `${BASE_URL}/admin/brands/createBrand`,
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
export const getBrands = async (token, page = 1, perPage = 10, search = "") => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/brands/getBrands`, {
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
export const getBrandById = async (token, brandId) => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/brands/getBrandById`, {
      params: {
        brand_id: brandId,
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

// Update brand
export const updateBrand = async (brandData, token) => {
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
      `${BASE_URL}/admin/brands/updateBrand`,
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
export const deleteBrand = async (token, brandId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/admin/brands/deleteBrand`,
      {
        params: {
          brand_id: brandId,
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
