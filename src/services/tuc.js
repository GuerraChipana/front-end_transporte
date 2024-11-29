import api from "./api";

export const registrarTuc = async (formdata) => {
  try {
    const response = await api.post("/tuc", formdata);
    return response.data;
  } catch (error) {
    if (error.message) {
      throw new Error(error.response.data.message || "Error descononcido");
    } else {
      throw new Error("Error al crear una tarjeta de circulación");
    }
  }
};

export const actualizarTuc = async (id, formdata) => {
  try {
    const response = await api.patch(`/tuc/${id}`, formdata);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error("Error al actualizar la tarjeta de circulación");
    }
  }
};

export const obtenerTucPorId = async (id) => {
  try {
    const response = await api.get(`/tuc/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error(
        `Error al obtener la tarjeta de circulacion con el id ${id}`
      );
    }
  }
};

export const listarTuc = async () => {
  try {
    const response = await api.get("/tuc");
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error descononcido");
    } else {
      throw new Error("Error al listar las Tucs");
    }
  }
};

export const cambiarEstadoTuc = async (id, estado) => {
  try {
    const response = await api.patch(`/tuc/estado/${id}`, estado);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error(`Error al cambiar estado del Tuc con id ${id}`);
    }
  }
};
