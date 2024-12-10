import api from "./api";

// Función para registrar un nuevo vehículo con imagen
export const registrarVehiculo = async (formData) => {
  try {
    const response = await api.post("/vehiculos", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Es importante que se especifique
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error("Error al registrar el vehículo");
    }
  }
};

// Función para listar todos los vehículos
export const listarVehiculos = async () => {
  try {
    const response = await api.get("/vehiculos");
    return response.data;
  } catch (error) {
    console.error("Error al listar los vehículos:", error);
    throw new Error("Error al obtener la lista de vehículos");
  }
};

// Función para cambiar el estado de un vehículo
export const cambiarEstadoVehiculo = async (id, estado) => {
  try {
    const cambioEstado = {
      estado: estado.estado, // El nuevo estado del vehículo (1 o 0)
      detalle_baja: estado.detalle_baja || "", // Detalle de baja si el estado es inactivo
    };
    const response = await api.patch(`/vehiculos/estado/${id}`, cambioEstado);
    return response.data;
  } catch (error) {
    console.error("Error al cambiar el estado del vehículo:", error);
    throw new Error("Error al cambiar el estado del vehículo");
  }
};

// Función para actualizar un vehículo con imagen
export const actualizarVehiculo = async (id, formData) => {
  try {
    const response = await api.patch(`/vehiculos/edit/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Es importante que se especifique
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Si el error tiene respuesta, imprimir detalles
      throw new Error(error.response.data.message || "Error desconocido");
    } else {
      throw new Error("Error al actualizar el vehículo");
    }
  }
};

// Función para obtener un vehículo por ID
export const obtenerVehiculoPorId = async (id) => {
  try {
    const response = await api.get(`/vehiculos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el vehículo con ID ${id}:`, error);
    throw new Error(`Error al obtener el vehículo con ID ${id}`);
  }
};
