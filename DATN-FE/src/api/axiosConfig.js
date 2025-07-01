// src/api/axiosConfig.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL_BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
