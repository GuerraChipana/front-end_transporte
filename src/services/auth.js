// services/auth.js
import api from "./api";

export const login = async (username, password) => {
  try {
    // Enviar las credenciales de inicio de sesión al servidor
    const response = await api.post("/login", { username, password });

    // Obtener el access_token de la respuesta
    const { access_token } = response.data;

    // Guardar el token en sessionStorage (para que se elimine cuando se cierre la sesión o el navegador)
    sessionStorage.setItem("token", access_token);

    return access_token;
  } catch (error) {
    throw new Error("Error al iniciar sesión");
  }
};

// Función para obtener la información de bienvenida
export const getWelcomeInfo = async () => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error("Token no encontrado en sessionStorage");
    }
    const response = await api.get("/login");
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener los datos del usuario");
  }
};

export const cuenta = async () => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) throw new Error("Token no encontrado");
    const response = await api.get("/login/cuenta");
    return response.data;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
};
