import axios from "axios";

export const createOrder = (url, amount, token) => {
  return axios.post(
    `${url}/api/payment/create-order`,
    { amount },
    { headers: { token } }
  );
};
