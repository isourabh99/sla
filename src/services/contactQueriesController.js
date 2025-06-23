import axios from "axios";
import config from "../config";

const BASE_URL = config.api.baseUrl;

export async function getContactQueries(token) {
  try {
    const response = await axios.get(`${BASE_URL}/admin/contact/getContact`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch contact queries"
    );
  }
}

export async function replyToContactQuery(token, contact_id, reply) {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/contact/reply/Contact?contact_id=${contact_id}&reply=${encodeURIComponent(
        reply
      )}`,
      {},
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
      error.response?.data?.message || "Failed to send reply to contact query"
    );
  }
}
