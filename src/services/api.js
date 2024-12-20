import axios from "axios";
import { useNavigate } from "react-router-dom"; // Para redirigir al login si el token expira

const api = axios.create({
  baseURL: "", // Lo dejamos vacío por ahora
  headers: {
    "Content-Type": "application/json",
  },
});

// Función para verificar si el servidor local está activo
const checkLocalhost = async () => {
  const localhostURL = "http://localhost:3000/api/busqueda/hola";
  const remoteURL = "https://servidor-transporte.onrender.com/api";

  try {
    // Intentamos hacer una solicitud al servidor local para comprobar si está activo
    const response = await axios.get(localhostURL);
    if (response.status === 200) {
      // Si la solicitud es exitosa, usamos la URL local
      return 'http://localhost:3000/api';
    } else {
      // Si el servidor local responde pero con un error, usamos la URL remota
      return remoteURL;
    }
  } catch (error) {
    // Si hay un error en la solicitud (es decir, el servidor local no está disponible), usamos la URL remota
    return remoteURL;
  }
};

// Configuramos la URL base de la API después de comprobar
const setBaseURL = async () => {
  const baseURL = await checkLocalhost();
  api.defaults.baseURL = baseURL;
};

setBaseURL(); // Llamamos a la función para configurar el baseURL

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
