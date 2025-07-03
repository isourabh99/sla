import axios from "axios";
import config from "../config";

const BASE_URL = config.api.baseUrl;

export async function getPendingPartners(token, page = 1) {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/partner/getPendingPartners`,
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
      error.response?.data?.message || "Failed to fetch pending partners"
    );
  }
}

export async function getPartners(token, page = 1,quotationId) {
  try {
    const response = await axios.get(`${BASE_URL}/admin/partner/getPartners`, {
      params: {
        page: page,
        quotation_id: quotationId,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch approved partners"
    );
  }
}

export async function getPartnerDetails(token, partnerId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/partner/getPartnerDetails`,
      {
        params: {
          partner_id: partnerId,
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
      error.response?.data?.message || "Failed to fetch partner details"
    );
  }
}

export async function updatePartnerStatus(token, partnerId, status) {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/partner/statusUpdate`,
      {
        partner_id: partnerId,
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
      error.response?.data?.message || "Failed to update partner status"
    );
  }
}

export async function updatePartner(token, formData) {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/partner/updatePartner`,
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
      error.response?.data?.message || "Failed to update partner details"
    );
  }
}
