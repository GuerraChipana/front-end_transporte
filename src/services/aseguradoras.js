import api from "./api";

export const registrarAseguradora = async (formdata) => {
  try {
    const response = await api.post("/aseguradoras", formdata);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error("Error al crear aseguradora");
    }
  }
};

export const actualizarAseguradora = async (id, formdata) => {
  try {
    const response = await api.patch(`/aseguradoras/edit/${id}`, formdata);
    return response.data;
  } catch (error) {
    if (error.message) {
      throw new Error(error.message.data.message || "Error desconocido");
    } else {
      throw new Error("Error al actualizar la aseguradora");
    }
  }
};

export const listarAseguradoras = async () => {
  try {
    const response = await api.get("/aseguradoras");
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error("Error al listar aseguradoras");
    }
  }
};

export const obtenerAseguradoraPorId = async (id) => {
  try {
    const response = await api.get(`/vehiculos/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error(`Error al obtener aseguradora con el id ${id}`);
    }
  }
};

export const cambiarEstadoAseguradora = async (id, estado) => {
  try {
    const response = await api.patch(`/aseguradoras/estado/${id}`, estado);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error(`Error al cambiar estado a la aseguradora ${id}`);
    }
  }
};
