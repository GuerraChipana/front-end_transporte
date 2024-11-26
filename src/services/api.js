// src/services/api.js
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Para redirigir al login si el token expira

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

// Interceptor para manejar la respuesta y verificar la expiración del token
api.interceptors.response.use(
  (response) => {
    return response; // Si la respuesta es correcta, simplemente la retorna
  },
  (error) => {
    // Si el error es por un token expirado (por lo general, el servidor responderá con 401)
    if (error.response && error.response.status === 401) {
      // Limpiamos el token del sessionStorage
      sessionStorage.removeItem("token");

      // Redirigimos al usuario a la página de login
      window.location.href = "/login"; // Redirige a login (también puedes usar un Navigate si estás usando hooks)
    }

    return Promise.reject(error); // Retorna el error si no es 401
  }
);

export default api;
