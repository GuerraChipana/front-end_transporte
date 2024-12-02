import api from "./api";

export const registrarConductor = async (formdata) => {
  try {
    const response = await api.post("/conductores", formdata);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error("Error al crear un conductor");
    }
  }
};

export const actualizarConductor = async (id, formdata) => {
  try {
    const response = await api.patch(`/conductores/edit/${id}`, formdata);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error("Error al actualizar el conductor");
    }
  }
};

export const listarConductores = async () => {
  try {
    const response = await api.get("/conductores");
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error("Error al listar los conductores");
    }
  }
};

export const obtenerConductorPorId = async (id) => {
  try {
    const response = await api.get(`/conductores/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error(`Error al obtener conductor con el id ${id}`);
    }
  }
};

export const cambiarEstadoConductores = async (id, estado) => {
  try {
    const response = await api.patch(`/conductores/estado/${id}`, estado);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error(`Error al cambiar estado del conductor con id ${id}`);
    }
  }
};
