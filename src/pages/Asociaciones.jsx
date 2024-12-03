import { useState, useEffect } from "react";
import { listarAsociaciones } from "../services/asociaciones";
import { getUserRoleFromToken } from "../utils/authHelper";
import AsociacionTabla from "../components/asociaciones/AsociacionTable";
import AsociacionModal from "../components/asociaciones/AsociacionModal";
import '../styles/asociaciones.css';

const Asociaciones = () => {
  const rol = getUserRoleFromToken();
  const [asociaciones, setAsociaciones] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState('crear');
  const [asociacionId, setAsociacionId] = useState(null);
  const [buscarAsociacion, setBuscarAsociacion] = useState('');
  const [mostrarDesactivados, setMostrarDesactivados] = useState(false); // Estado para alternar entre activos y desactivados

  useEffect(() => {
    const fetchAsociaciones = async () => {
      try {
        const asociacionData = await listarAsociaciones();
        setAsociaciones(asociacionData);
      } catch (error) {
        console.error(`Error al obtener las asociaciones:`, error);
      }
    };
    fetchAsociaciones();
  }, []);

  const filtroAsociacion = asociaciones
    .filter((asociacion) =>
      (asociacion.nombre).toLowerCase().includes(buscarAsociacion.toLowerCase())
    )
    .filter((asociacion) => {
      // Filtrar según el estado de mostrarDesactivados
      return mostrarDesactivados ? asociacion.estado === 0 : asociacion.estado === 1;
    });

  const handleUpdate = () => {
    const fetchAsociaciones = async () => {
      try {
        const asociacionesData = await listarAsociaciones();
        setAsociaciones(asociacionesData);
      } catch (error) {
        console.error('Error al obtener las asociaciones:', error);
      }
    };
    fetchAsociaciones();
  };

  const toggleEstado = () => {
    setMostrarDesactivados(!mostrarDesactivados);
  };

  return (
    <div className="asoaciones-gestion-container">
      <h2 className="asoaciones-gestion-title">Gestión de Asociaciones</h2>
      <div className="asociaciones-seach-container">
        <input
          type="text"
          placeholder="Buscar Asociación"
          value={buscarAsociacion}
          onChange={(e) => setBuscarAsociacion(e.target.value)}
          className="asoaciones-search-input"
        />
      </div>
      <div className="asoaciones-filter-container">
        <div className="asoaciones-filter-buttons">
          <button
            className="asoaciones-button"
            onClick={toggleEstado}
          >
            {mostrarDesactivados ? "Mostrar Activos" : "Mostrar Desactivados"}
          </button>
        </div>
        {(rol === "superadministrador" || rol === "administrador") && (
          <button
            className="asoaciones-button asoaciones-button-create"
            onClick={() => {
              setModalIsOpen(true);
              setTipoModal('crear');
            }}
          >
            Crear Asociación
          </button>
        )}
      </div>

      <AsociacionTabla
        asociaciones={filtroAsociacion}
        onEdit={(id) => {
          setAsociacionId(id);
          setTipoModal('editar');
          setModalIsOpen(true);
        }}
        onEstado={handleUpdate}
      />
      {modalIsOpen && (
        <AsociacionModal
          tipoModal={tipoModal}
          asociacionId={asociacionId}
          setModalIsOpen={setModalIsOpen}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default Asociaciones;
