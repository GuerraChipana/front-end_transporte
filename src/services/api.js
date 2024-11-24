// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3030",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token en cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
