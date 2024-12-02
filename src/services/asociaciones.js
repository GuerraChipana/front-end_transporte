import api from "./api";

export const registrarAsociacion = async (formdata) => {
  try {
    const response = await api.post("/asociaciones", formdata);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error("Error al crear la asociación");
    }
  }
};

export const actualizarAsociacion = async (id, formdata) => {
  try {
    const response = await api.patch(`/asociaciones/edit/${id}`, formdata);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error("Error al actualizar la asociación");
    }
  }
};

export const obtenerAsociacionPorId = async (id) => {
  try {
    const response = await api.get(`/asociaciones/listar/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error(`Error al obtener la asociación con el id ${id}`);
    }
  }
};

export const listarAsociaciones = async () => {
  try {
    const response = await api.get("/asociaciones/listar");
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error("Error al listar las asociaciones");
    }
  }
};

export const cambiarEstadoAsociacion = async (id, estado) => {
  try {
    const response = await api.patch(`/asociaciones/estado/${id}`, estado);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error(
        `Error al cambiar estado de la asociación con id ${id}`
      );
    }
  }
};
