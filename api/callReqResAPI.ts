import axios from "axios";

const API_URL = "https://reqres.in/api";

const callReqResAPI = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

callReqResAPI.interceptors.request.use(
  async (config) => {
    const token: string = "";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

callReqResAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);

export default callReqResAPI;
