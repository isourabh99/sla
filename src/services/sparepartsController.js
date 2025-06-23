import axios from "axios";
import config from "../config";

const BASE_URL = config.api.baseUrl;

// Fetch spare parts added by suppliers
export async function getSupplierSpareParts(token) {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/supplier/all/SpearPartDetails`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch supplier spare parts"
    );
  }
}

// Fetch spare parts added by customers
export async function getCustomerSpareParts(token) {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/supplier/all/User/SpearPartDetails`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch customer spare parts"
    );
  }
}

// Keep the original function for backward compatibility
export async function getAllSparePartDetails(token) {
  return getSupplierSpareParts(token);
}

// Keep the original function for backward compatibility
export async function getCustomerAddedSpareParts(token) {
  return getCustomerSpareParts(token);
}

// Update spare parts added by customers
export async function updateCustomerSparePart(token, sparePartId, updateData) {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/updateSparePart?spare_part_id=${sparePartId}`,
      updateData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update customer spare part"
    );
  }
}
