import api from "./api";

// Función para registrar un nuevo usuario
export const registrarUsuario = async (nuevoUsuario) => {
  try {
    const response = await api.post("/users/registrar", nuevoUsuario);
    return response.data;
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    throw new Error("Error al registrar el usuario");
  }
};

// Función para listar todos los usuarios
export const listarUsuarios = async () => {
  try {
    const response = await api.get("/users/listar");
    return response.data;
  } catch (error) {
    console.error("Error al listar los usuarios:", error);
    throw new Error("Error al obtener la lista de usuarios");
  }
};

// Función para cambiar el rol de un usuario
export const cambiarRolUsuario = async (id, nuevoRol) => {
  try {
    const response = await api.patch(`/users/rol/${id}`, { rol: nuevoRol });
    return response.data;
  } catch (error) {
    console.error("Error al cambiar el rol del usuario:", error);
    throw new Error("Error al cambiar el rol del usuario");
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

// Función para cambiar el estado de un usuario
export const cambiarEstadoUsuario = async (id, estado) => {
  try {
    const cambioEstado = {
      estado: estado.estado, // El nuevo estado del usuario (1 o 0)
      detalle_baja: estado.detalle_baja || "", // Detalle de baja si el estado es inactivo
    };
    const response = await api.patch(`/users/estado/${id}`, cambioEstado);
    return response.data;
  } catch (error) {
    console.error("Error al cambiar el estado del usuario:", error);
    throw new Error("Error al cambiar el estado del usuario");
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
