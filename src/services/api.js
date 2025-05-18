import axios from "axios";

// Inicializamos Axios sin baseURL inicialmente
const api = axios.create({
  baseURL: "https://servidor-transporte.fly.dev/api", // Inicialmente vacío, se configurará después
  headers: {
    "Content-Type": "application/json",
  },
});

// Función para verificar si alguno de los servidores está activo
export const checkServer = async () => {
  const servers = [
    "https://servidor-transporte.fly.dev/api", // Servidor 1
    "https://servidortransporte-copy-production.up.railway.app/api", // Servidor 2
    "https://a75d919c-cc98-4775-9ffb-c39d4268a7ad-00-5zoqb9b2fyo3.spock.replit.dev/api", // Servidor 3
  ];

  // Verificamos si ya existe una URL guardada en sessionStorage
  let storedBaseURL = sessionStorage.getItem("baseURL");
  if (storedBaseURL) {
    // Si la baseURL ya está guardada en sessionStorage, verificamos si es válida
    try {
      const response = await axios.get(storedBaseURL);
      if (response.status === 200) {
        api.defaults.baseURL = storedBaseURL;
        return;
      }
    } catch (error) {
      console.error(`Error con la baseURL guardada: ${error.message}`);
      sessionStorage.removeItem("baseURL"); // Eliminamos la baseURL almacenada
    }
  }

  // Si no hay una URL válida guardada o la guardada no es válida, probamos los servidores
  for (let i = 0; i < servers.length; i++) {
    try {
      const response = await axios.get(servers[i]);
      if (response.status === 200) {
        api.defaults.baseURL = servers[i]; // Establecemos esta URL como baseURL
        sessionStorage.setItem("baseURL", servers[i]); // Guardamos la nueva baseURL
        return;
      }
    } catch (error) {
      console.log(`Servidor ${i + 1} no disponible: ${error.message}, probando con el siguiente...`);
    }
  }
  throw new Error("No se pudo conectar con los servidores.");
};

// Llamamos a la función para configurar el baseURL
checkServer().catch((error) => {
  console.error(error.message);
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
