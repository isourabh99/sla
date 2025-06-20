import axios from "axios";
import config from "../config";

const BASE_URL = config.api.baseUrl;

// Fetch all spare part details
export async function getAllSparePartDetails(token) {
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
      error.response?.data?.message || "Failed to fetch spare part details"
    );
  }
}
