import api from "./api";

export const buscarPersona = async (formData) => {
  try {
    const response = await api.post("/personas/buscar", formData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error(`Error al obtener datos de busqueda`);
    }
  }
};

// Función para registrar una persona
export const registrarPersona = async (formData) => {
  try {
    const response = await api.post("/personas/crear", formData);
    return response.data;
  } catch (error) {
    throw new Error("Error al registrar la persona");
  }
};

// Función para listar todas las personas
export const listarPersonas = async () => {
  try {
    const response = await api.get("/personas");
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener la lista de personas");
  }
};

// Función para obtener una persona por su ID
export const obtenerPersonaPorId = async (id) => {
  try {
    const response = await api.get(`/personas/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener la persona con ID ${id}`);
  }
};

// Función para cambiar el estado de una persona
export const cambiarEstadoPersona = async (id, estado) => {
  try {
    const response = await api.patch(`/personas/${id}/estado`, estado);
    return response.data;
  } catch (error) {
    throw new Error(`Error al cambiar el estado de la persona con ID ${id}`);
  }
};

// Función para actualizar los datos de una persona
export const actualizarPersona = async (id, formData) => {
  try {
    const response = await api.patch(`/personas/${id}`, formData);
    return response.data;
  } catch (error) {
    throw new Error(`Error al actualizar la persona con ID ${id}`);
  }
};
