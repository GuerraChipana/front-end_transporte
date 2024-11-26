import React, { useState, useEffect } from "react";
import VehiculosTable from "../components/vehiculos/vehiculoTable";
import VehiculoModal from "../components/vehiculos/vehiculoModal";
import { listarVehiculos } from "../services/vehiculos"; // Importar la función para listar vehículos
import { getUserRoleFromToken } from "../utils/authHelper";

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState("crear");
  const [vehiculoId, setVehiculoId] = useState(null);
  const [searchPlaca, setSearchPlaca] = useState(""); // Estado para el filtro de placa

  // Obtener el rol del usuario desde el token
  const rol = getUserRoleFromToken(); // Llamamos a la función para obtener el rol

  useEffect(() => {
    const fetchVehiculos = async () => {
      const vehiculosData = await listarVehiculos();
      setVehiculos(vehiculosData);
    };
    fetchVehiculos();
  }, []);

  const handleEdit = (id) => {
    setTipoModal("editar");
    setVehiculoId(id);
    setModalIsOpen(true);
  };

  const handleChangeState = () => {
    const fetchVehiculos = async () => {
      const vehiculosData = await listarVehiculos();
      setVehiculos(vehiculosData);
    };
    fetchVehiculos();
  };

  const handleAddVehiculo = () => {
    setTipoModal("crear");
    setVehiculoId(null); // Al crear, no hay un vehículo específico
    setModalIsOpen(true); // Abre el modal
  };

  // Filtrar los vehículos por placa
  const filteredVehiculos = vehiculos.filter((vehiculo) =>
    vehiculo.placa.toLowerCase().includes(searchPlaca.toLowerCase())
  );

  return (
    <div>
      <h2>Gestión de Vehículos</h2>

      {/* Condicionalmente mostrar los botones solo si el rol es superadministrador o administrador */}
      {(rol === "superadministrador" || rol === "administrador") && (
        <div>
          <button onClick={handleAddVehiculo}>Agregar Vehículo</button>
        </div>
      )}

      {/* Filtro de placa */}
      <div>
        <input
          type="text"
          placeholder="Buscar por placa"
          value={searchPlaca}
          onChange={(e) => setSearchPlaca(e.target.value)} // Actualizar el valor del filtro
        />
      </div>

      <VehiculosTable
        vehiculos={filteredVehiculos} // Pasa los vehículos filtrados
        onEdit={handleEdit}
        onChangeState={handleChangeState}
      />

      <VehiculoModal
        tipo={tipoModal}
        vehiculoId={vehiculoId}
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onVehiculoUpdated={handleChangeState} // Pasa la función para actualizar la tabla
      />
    </div>
  );
};

export default Vehiculos;
