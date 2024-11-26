import api from "./api";
export const registrarSeguroVehicular = async (formdata) => {
  try {
    const response = await api.post("/vehiculo-seguros", formdata);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error("Error al crear el seguro vehicular");
    }
  }
};

export const actualizarSeguroVehicular = async (id, formdata) => {
  try {
    const response = await api.patch(`/vehiculo-seguros/${id}`, formdata);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error("Error al actualizar el seguro vehicular");
    }
  }
};

export const listarSegurosVehiculares = async () => {
  try {
    const response = await api.get("/vehiculo-seguros");
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error("Error al listar los seguros vehiculares");
    }
  }
};

export const obtenerSeguroVehicularPorId = async (id) => {
  try {
    const response = await api.get(`/vehiculo-seguros/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error(`Error al obtener el seguro vehicular con el id ${id}`);
    }
  }
};

export const cambiarEstadoSeguroVehicular = async (id, estado) => {
  try {
    const response = await api.patch(`/vehiculo-seguros/estado/${id}`, estado);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error(
        `Error al cambiar estado del seguro vehicular con id ${id}`
      );
    }
  }
};
