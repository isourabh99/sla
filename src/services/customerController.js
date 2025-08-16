import axios from "axios";
import config from "../config";

const BASE_URL = config.api.baseUrl;

const getCustomers = async (token, page = 1) => {
  const response = await axios.get(
    `${BASE_URL}/admin/customer/getCustomer?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const getCustomerById = async (token, userId) => {
  const response = await axios.get(
    `${BASE_URL}/admin/customer/getCustomerById?user_id=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export { getCustomers, getCustomerById };
