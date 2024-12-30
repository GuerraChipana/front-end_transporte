import { useState, useEffect } from "react";
import { listarConductores } from "../services/conductores";
import { getUserRoleFromToken } from "../utils/authHelper";
import ConductoresTable from "../components/conductores/ConductoresTable";
import ConductoresModal from "../components/conductores/ConductoresModal";
import '../styles/conductor.css';

const Conductores = () => {
  const rol = getUserRoleFromToken();
  const [conductores, setConducotres] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState('crear');
  const [conductorId, setConductorId] = useState(null);
  const [buscarDNI, setBuscarDNI] = useState('');
  const [mostrarActivos, setMostrarActivos] = useState(true); // Nuevo estado para filtrar por activo/inactivo

  useEffect(() => {
    const fetchConductores = async () => {
      try {
        const conductorData = await listarConductores();
        setConducotres(conductorData);
      } catch (error) {
        console.error('Error al obtener los conductores', error);
      }
    };
    fetchConductores();
  }, []);

  // Filtrar conductores por estado y por DNI
  const filtroConductores = conductores.filter((conductor) =>
    conductor.id_persona.dni.toLowerCase().includes(buscarDNI.toLowerCase()) &&
    (mostrarActivos ? conductor.estado === 1 : conductor.estado === 0)
  );

  const handleUpdate = () => {
    const fetchConductores = async () => {
      try {
        const conductorData = await listarConductores();
        setConducotres(conductorData);
      } catch (error) {
        console.error('Error al obtener los conductores', error);
      }
    };
    fetchConductores();
  };

  return (
    <div className="conductor-gestion-container">
      <h2>Gestión de Conductores</h2>
      <div className="conductor-search-container">
        <input
          type="text"
          placeholder="Buscar por DNI"
          value={buscarDNI}
          onChange={(e) => setBuscarDNI(e.target.value)}
        />
      </div>

      <div className="conductor-botones-container">
        {/* Botón para alternar entre activos e inactivos */}
        <div className="conductor-toggle-button-container">
          <button
            className="conductor-button conductor-toggle-button"
            onClick={() => setMostrarActivos(!mostrarActivos)}
          >
            {mostrarActivos ? 'Ver Inactivos' : 'Ver Activos'}
          </button>
        </div>

        <div>
          {(rol === "superadministrador" || rol === "administrador") && (
            <button
              className="conductor-button-create"
              onClick={() => { setModalIsOpen(true); setTipoModal('crear'); }}
            >
              Crear Conductor
            </button>
          )}
        </div>
        
      </div>

      <ConductoresTable
        conductores={filtroConductores}
        onEdit={(id) => {
          setConductorId(id);
          setTipoModal('editar');
          setModalIsOpen(true);
        }}
        onEstado={handleUpdate}
      />

      {modalIsOpen && (
        <ConductoresModal
          tipoModal={tipoModal}
          conductorId={conductorId}
          setModalIsOpen={setModalIsOpen}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default Conductores;
