import axios from "axios";
import config from "../config";

const BASE_URL = config.api.baseUrl;

export const createStaff = async (staffData, token) => {
  try {
    const formData = new FormData();

    // Append all text fields
    Object.keys(staffData).forEach((key) => {
      if (key !== "profile_picture") {
        formData.append(key, staffData[key]);
      }
    });

    // Handle profile picture if it exists
    if (staffData.profile_picture && staffData.profile_picture[0]) {
      formData.append("profile_picture", staffData.profile_picture[0]);
    }

    const response = await axios.post(
      `${BASE_URL}/admin/staff/createStaff`,
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

export const getStaffs = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/staff/getStaffs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getStaffById = async (staffId, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/staff/getStaffById`, {
      params: {
        staff_id: staffId,
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

export const updateStaff = async (staffData, token) => {
  try {
    const formData = new FormData();

    // Append all text fields except latitude and longitude
    Object.keys(staffData).forEach((key) => {
      if (
        key !== "profile_picture" &&
        key !== "latitude" &&
        key !== "longitude"
      ) {
        formData.append(key, staffData[key]);
      }
    });

    // Handle profile picture if it exists and is a new file
    if (staffData.profile_picture && staffData.profile_picture[0]) {
      formData.append("profile_picture", staffData.profile_picture[0]);
    }

    const response = await axios.post(
      `${BASE_URL}/admin/staff/updateStaff`,
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

