// services/usuarios.js
import api from "./api"; // Importamos la instancia de Axios configurada

// Función para registrar un nuevo usuario
export const registrarUsuario = async (nuevoUsuario) => {
  try {
    // Aseguramos que el objeto `nuevoUsuario` tiene la estructura correcta
    const response = await api.post("/users/registrar", nuevoUsuario); // Endpoint para registrar usuario
    return response.data;
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    throw new Error("Error al registrar el usuario");
  }
};

// Función para listar todos los usuarios
export const listarUsuarios = async () => {
  try {
    const response = await api.get("/users/listar"); // Endpoint para listar usuarios
    return response.data;
  } catch (error) {
    console.error("Error al listar los usuarios:", error);
    throw new Error("Error al obtener la lista de usuarios");
  }
};

// Función para buscar un usuario por su ID
export const obtenerUsuarioPorId = async (id) => {
  try {
    const response = await api.get(`/users/${id}`); // Endpoint para obtener un usuario por ID
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el usuario con ID ${id}:`, error);
    throw new Error(`Error al obtener el usuario con ID ${id}`);
  }
};

// Función para cambiar el rol de un usuario
export const cambiarRolUsuario = async (id, nuevoRol) => {
  try {
    // Creamos el objeto `cambiarRol` con el rol que se pasará al backend
    const cambiarRol = {
      rol: nuevoRol,
    };

    const response = await api.patch(`/users/rol/${id}`, cambiarRol); // Endpoint para cambiar rol
    return response.data;
  } catch (error) {
    console.error("Error al cambiar el rol del usuario:", error);
    throw new Error("Error al cambiar el rol del usuario");
  }
};

// Función para cambiar las credenciales de un usuario (como la contraseña)
export const cambiarCredencialesUsuario = async (credenciales) => {
  try {
    // El objeto `credenciales` debe incluir los campos necesarios para cambiar las credenciales
    const response = await api.patch("/users/cambio-credencial", credenciales); // Endpoint para cambiar credenciales
    return response.data;
  } catch (error) {
    console.error("Error al cambiar las credenciales del usuario:", error);
    throw new Error("Error al cambiar las credenciales del usuario");
  }
};

// Función para cambiar el estado de un usuario
export const cambiarEstadoUsuario = async (id, estado) => {
  try {
    // El objeto `estado` debe incluir `estado` y `detalle_baja` (si aplica)
    const cambioEstado = {
      estado: estado.estado, // El nuevo estado del usuario (activo/inactivo)
      detalle_baja: estado.detalle_baja || "", // Detalles sobre la baja (si corresponde)
    };

    const response = await api.patch(`/users/estado/${id}`, cambioEstado); // Endpoint para cambiar estado de usuario
    return response.data;
  } catch (error) {
    console.error("Error al cambiar el estado del usuario:", error);
    throw new Error("Error al cambiar el estado del usuario");
  }
};
