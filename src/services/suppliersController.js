import axios from "axios";
import config from "../config";

const BASE_URL = config.api.baseUrl;

export async function getPendingSuppliers(token, page = 1) {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/supplier/getPendingSuppliers`,
      {
        params: {
          page: page,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch pending suppliers"
    );
  }
}

export async function getApprovedSuppliers(token, page = 1) {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/supplier/getSuppliers`,
      {
        params: {
          page: page,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch approved suppliers"
    );
  }
}

export async function getSupplierDetails(token, supplierId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/supplier/getSupplierDetails?supplier_id=${supplierId}`,
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
      error.response?.data?.message || "Failed to fetch supplier details"
    );
  }
}

export async function updateSupplierStatus(token, supplierId, status) {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/supplier/statusUpdate`,
      {
        supplier_id: supplierId,
        status: status,
      },
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
      error.response?.data?.message || "Failed to update supplier status"
    );
  }
}
