import api from "./api";

export const registrarEmpadronamiento = async (formdata) => {
  try {
    const response = await api.post("/empadronamiento", formdata);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error("Error al crear un empadronamiento");
    }
  }
};

export const actualizarEmpadronamiento = async (id, formdata) => {
  try {
    const response = await api.patch(`/empadronamiento/${id}`, formdata);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error("Error al actualizar el empadronamiento");
    }
  }
};

export const listarEmpadronamiento = async () => {
  try {
    const response = await api.get("/empadronamiento");
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error("Error al listar empadronamientos");
    }
  }
};

export const obtenerEmpadronamientoPorId = async (id) => {
  try {
    const response = await api.get(`/empadronamiento/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error(`Error al obtener empadronamiento con el id ${id}`);
    }
  }
};

export const cambiarEstadoEmpadronamiento = async (id, estado) => {
  try {
    const response = await api.patch(`/empadronamiento/estado/${id}`, estado);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error(
        `Error al cambiar estado del empadronamiento con id ${id}`
      );
    }
  }
};
