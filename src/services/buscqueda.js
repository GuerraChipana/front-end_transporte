import api from "./api";

export const busquedaPlaca = async (placa) => {
  try {
    const response = await api.get(`/busqueda/placa/${placa}`);
    return response.data; // Retorna los datos obtenidos de la API
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error al buscar por placa"
      );
    } else {
      throw new Error("Error al realizar la búsqueda por placa");
    }
  }
};

export const busquedaEmpadronamiento = async (empadro) => {
  try {
    const response = await api.get(`/busqueda/empadronamiento/${empadro}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error al buscar por empadronamiento"
      );
    } else {
      throw new Error("Error al realizar la búsqueda por empadronamiento");
    }
  }
};
