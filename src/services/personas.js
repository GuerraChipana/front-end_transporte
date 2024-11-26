import api from "./api";
import { getUserRoleFromToken } from "../utils/authHelper";

// Función para verificar el rol del usuario
const tienePermiso = (rolesPermitidos) => {
  const rolUsuario = getUserRoleFromToken();
  return rolesPermitidos.includes(rolUsuario);
};

// Función para registrar una persona
export const registrarPersona = async (persona) => {
  try {
    if (!tienePermiso(["superadministrador", "administrador"])) {
      throw new Error("No tienes permisos para registrar personas");
    }

    const response = await api.post("/personas/registro", persona);
    return response.data;
  } catch (error) {
    console.error("Error al registrar la persona:", error);
    throw new Error("Error al registrar la persona");
  }
};

// Función para listar todas las personas
export const listarPersonas = async () => {
  try {
    if (
      !tienePermiso([
        "superadministrador",
        "administrador",
        "moderador",
        "asistente",
      ])
    ) {
      throw new Error("No tienes permisos para listar personas");
    }

    const response = await api.get("/personas");
    return response.data;
  } catch (error) {
    console.error("Error al listar las personas:", error);
    throw new Error("Error al obtener la lista de personas");
  }
};

// Función para obtener una persona por su ID
export const obtenerPersonaPorId = async (id) => {
  try {
    if (
      !tienePermiso([
        "superadministrador",
        "administrador",
        "moderador",
        "asistente",
      ])
    ) {
      throw new Error("No tienes permisos para obtener la persona");
    }

    const response = await api.get(`/personas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la persona con ID ${id}:`, error);
    throw new Error(`Error al obtener la persona con ID ${id}`);
  }
};

// Función para cambiar el estado de una persona
export const cambiarEstadoPersona = async (id, estado) => {
  try {
    if (!tienePermiso(["superadministrador", "administrador"])) {
      throw new Error(
        "No tienes permisos para cambiar el estado de la persona"
      );
    }

    const response = await api.patch(`/personas/${id}/estado`, estado);
    return response.data;
  } catch (error) {
    console.error(
      `Error al cambiar el estado de la persona con ID ${id}:`,
      error
    );
    throw new Error(`Error al cambiar el estado de la persona con ID ${id}`);
  }
};

// Función para actualizar los datos de una persona
export const actualizarPersona = async (id, persona) => {
  try {
    if (!tienePermiso(["superadministrador", "administrador"])) {
      throw new Error("No tienes permisos para actualizar la persona");
    }

    const response = await api.patch(`/personas/${id}`, persona);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la persona con ID ${id}:`, error);
    throw new Error(`Error al actualizar la persona con ID ${id}`);
  }
};
