import axios from "axios";
import config from "../config";
const BASE_URL = config.api.baseUrl;
export const getCountries = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/countries`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return { status: false, message: error.message };
  }
};

export const addCountry = async (data, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/admin/countries`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return { status: false, message: error.message };
  }
};

export const updateCountry = async (id, data, token) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/admin/countries/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    return { status: false, message: error.message };
  }
};

export const deleteCountry = async (id, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/admin/countries/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    return { status: false, message: error.message };
  }
};
