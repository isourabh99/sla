import axios from "axios";
import config from "../config";

const BASE_URL = config.api.baseUrl;

export async function getPendingEngineers(token, page = 1) {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/engineer/getPendingEngineers`,
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
      error.response?.data?.message || "Failed to fetch pending engineers"
    );
  }
}

export async function getApprovedEngineers(token, page = 1, quotationId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/engineer/getEngineers`,
      {
        params: {
          page: page,
          quotation_id: quotationId,
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
      error.response?.data?.message || "Failed to fetch approved engineers"
    );
  }
}

export async function getEngineerDetails(token, engineerId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/engineer/getEngineerDetails?engineer_id=${engineerId}`,
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
      error.response?.data?.message || "Failed to fetch engineer details"
    );
  }
}

export async function updateEngineerStatus(token, engineerId, status) {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/engineer/statusUpdate`,
      {
        engineer_id: engineerId,
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
      error.response?.data?.message || "Failed to update engineer status"
    );
  }
}

export async function updateEngineer(token, formData) {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/engineer/updateEngineer`,
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
    if (error.response?.status === 422) {
      // Handle validation errors
      const validationErrors = error.response.data.errors;
      if (validationErrors) {
        const errorMessages = Object.entries(validationErrors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("\n");
        throw new Error(`Validation failed:\n${errorMessages}`);
      }
    }
    throw new Error(
      error.response?.data?.message || "Failed to update engineer details"
    );
  }
}

export async function importEngineersExcel(token, formData) {
  try {
    console.log("API: Starting import request");
    console.log("API: URL:", `${BASE_URL}/importEngineersExcel`);
    console.log("API: Token available:", !!token);
    console.log("API: FormData entries:", Array.from(formData.entries()));

    const response = await axios.post(
      `${BASE_URL}/importEngineersExcel`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API: Response received:", response.data);
    return response.data;
  } catch (error) {
    console.error("API: Error occurred:", error);
    console.error("API: Error response:", error.response);
    console.error("API: Error status:", error.response?.status);
    console.error("API: Error data:", error.response?.data);

    if (error.response?.status === 422) {
      // Handle validation errors
      const validationErrors = error.response.data.errors;
      if (validationErrors) {
        const errorMessages = Object.entries(validationErrors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("\n");
        throw new Error(`Validation failed:\n${errorMessages}`);
      }
    }
    throw new Error(
      error.response?.data?.message || "Failed to import engineers from Excel"
    );
  }
}
