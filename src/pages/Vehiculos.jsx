import React, { useState, useEffect } from "react";
import VehiculosTable from "../components/vehiculos/vehiculoTable";
import VehiculoModal from "../components/vehiculos/vehiculoModal";
import { listarVehiculos } from "../services/vehiculos";
import { getUserRoleFromToken } from "../utils/authHelper";
import '../styles/vehiculos.css';

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState("crear");
  const [vehiculoId, setVehiculoId] = useState(null);
  const [searchPlaca, setSearchPlaca] = useState("");
  const [mostrarActivos, setMostrarActivos] = useState(true); // Estado para filtrar por activo/inactivo

  const rol = getUserRoleFromToken();

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
    setVehiculoId(null);
    setModalIsOpen(true);
  };

  const filteredVehiculos = Array.isArray(vehiculos)
    ? vehiculos.filter((vehiculo) =>
      vehiculo.placa.toLowerCase().includes(searchPlaca.toLowerCase()) &&
      (mostrarActivos ? vehiculo.estado === 1 : vehiculo.estado === 0)
    )
    : []; // Si no es un array, devolvemos un array vacío


  return (
    <div className="vehiculo-gestion-container">
      <h2>Gestión de Vehículos</h2>

      {/* Filtro y botones en la misma línea */}
      <div className="vehiculo-filtro-y-botones">
        <div className="vehiculo-filtro-container">
          <input
            type="text"
            className="vehiculo-search-input"
            placeholder="Buscar por placa"
            value={searchPlaca}
            onChange={(e) => setSearchPlaca(e.target.value)}
          />
        </div>

        {/* Botones de acción en la misma fila */}
        <div className="vehiculo-botones-container">
          {(rol === "superadministrador" || rol === "administrador") && (
            <button className="vehiculo-button" onClick={handleAddVehiculo}>
              Agregar Vehículo
            </button>
          )}
          <button
            className="vehiculo-toggle-button"
            onClick={() => setMostrarActivos(!mostrarActivos)}
          >
            {mostrarActivos ? 'Ver Inactivos' : 'Ver Activos'}
          </button>
        </div>
      </div>

      <VehiculosTable
        vehiculos={filteredVehiculos}
        onEdit={handleEdit}
        onChangeState={handleChangeState}
      />

      <VehiculoModal
        tipo={tipoModal}
        vehiculoId={vehiculoId}
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onVehiculoUpdated={handleChangeState}
      />
    </div>
  );
};

export default Vehiculos;
