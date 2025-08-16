import axios from "axios";
import config from "../config";

const BASE_URL = config.api.baseUrl;

// Get all quotations
export const getQuotations = async (token, page = 1) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/quotation/getQuotations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
        },
      }
    );

    // console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get quotation details by ID
export const getQuotationDetails = async (token, quotationId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/quotation/getQuotationDetails`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          quotation_id: quotationId,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Assign staff to quotation
export const assignStaff = async (token, quotationId, staffId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/quotation/assignStaff`,
      {
        quotation_id: quotationId,
        staff_id: staffId,
      },
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

// Assign engineer to quotation
export const assignEngineer = async (token, quotationId, engineerId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/quotation/assignEngineer`,
      {
        quotation_id: quotationId,
        engineer_id: engineerId,
      },
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

// Assign partner to quotation
export const assignPartner = async (token, quotationId, partnerId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/quotation/assignPartner`,
      {
        quotation_id: quotationId,
        partner_id: partnerId,
      },
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

// Get offers by quotation ID
export const getOffersByQuotation = async (token, quotationId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin/quotation/getOffersByQuotation`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          quotation_id: quotationId,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update offer status
export const updateOfferStatus = async (token, quotationOfferId, status) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/quotation/updateOfferStatus`,
      {
        quotation_offer_id: quotationOfferId,
        status: status,
      },
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

// Approve quotation status
export const approveQuotationStatus = async (token, quotationId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/quotation/approve-status`,
      {
        quotation_id: quotationId,
        approved_status: true,
      },
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
