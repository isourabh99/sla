import axios from "axios";
import config from "../config";

const BASE_URL = config.api.baseUrl;

export const getNotifications = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/getNotifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const markNotificationAsRead = async (notificationId, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/mark-notification-read?notification_id=${notificationId}`,
      {},
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


