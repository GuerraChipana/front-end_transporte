import axios from "axios";

// Inicializamos Axios sin baseURL inicialmente
const api = axios.create({
  baseURL: "", // Inicialmente vacío, se configurará después
  headers: {
    "Content-Type": "application/json",
  },
});

// Función para verificar si alguno de los servidores está activo
const checkServer = async () => {
  const servers = [
    "https://servidortransporte-copy-production.up.railway.app/api", // Servidor 1
    "https://servidor-transporte.onrender.com/api", // Servidor 2
    "https://servidor3.example.com/api", // Servidor 3 (puedes añadir más si es necesario)
  ];

  // Verificamos si ya existe una URL guardada en sessionStorage
  const storedBaseURL = sessionStorage.getItem("baseURL");
  if (storedBaseURL) {
    // Si la baseURL ya está guardada en sessionStorage, la usamos
    api.defaults.baseURL = storedBaseURL;
    return; // Ya no necesitamos hacer más verificaciones
  }

  // Intentamos la primera URL
  try {
    const response = await axios.get(servers[0]);
    if (response.status === 200) {
      api.defaults.baseURL = servers[0]; // Establecemos la primera URL como baseURL
      sessionStorage.setItem("baseURL", servers[0]); // Guardamos la baseURL en sessionStorage
      return;
    }
  } catch (error) {
    console.log("Servidor 1 no disponible, probando con el siguiente...");
  }

  // Intentamos la segunda URL
  try {
    const response = await axios.get(servers[1]);
    if (response.status === 200) {
      api.defaults.baseURL = servers[1]; // Establecemos la segunda URL como baseURL
      sessionStorage.setItem("baseURL", servers[1]); // Guardamos la baseURL en sessionStorage
      return;
    }
  } catch (error) {
    console.log("Servidor 2 no disponible, probando con el siguiente...");
  }

  // Intentamos la tercera URL
  try {
    const response = await axios.get(servers[2]);
    if (response.status === 200) {
      api.defaults.baseURL = servers[2]; // Establecemos la tercera URL como baseURL
      sessionStorage.setItem("baseURL", servers[2]); // Guardamos la baseURL en sessionStorage
      return;
    }
  } catch (error) {
    console.log("Servidor 3 no disponible.");
  }

  // Si ninguno de los servidores responde correctamente
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
