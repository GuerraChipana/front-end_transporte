import { useState, useEffect } from "react";
import { listarEmpadronamiento } from "../services/empadronamiento";
import { getUserRoleFromToken } from "../utils/authHelper";
import EmpadronamientoModal from "../components/empadronamiento/EmpadronamientoModal";
import EmpadronamientoTabla from "../components/empadronamiento/EmpadronamientoTable";
import '../styles/empadronamiento.css'

const Empadronamiento = () => {
  const rol = getUserRoleFromToken();
  const [empadronamientos, setEmpadronamientos] = useState([]);
  const [tipoModal, setTipoModal] = useState('crear');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [empadronamientoId, setEmpadronamientoId] = useState(null);
  const [buscarEmpadronamiento, setBuscarEmpadronamiento] = useState('');
  const [mostrarDesactivados, setMostrarDesactivados] = useState(false); // Estado para controlar si se muestran desactivados

  useEffect(() => {
    const fetchEmpadronamientos = async () => {
      try {
        const empadronamientoData = await listarEmpadronamiento();
        setEmpadronamientos(empadronamientoData);
      } catch (error) {
        console.error('Error al obtener las asociaciones', error);
      }
    };
    fetchEmpadronamientos();
  }, []);

  const filtroEmpadronamiento = empadronamientos.filter((empadronamiento) => {
    const esActivo = empadronamiento.estado === 1;
    const esDesactivado = empadronamiento.estado === 0;
    
    // Si mostrarDesactivados es false, solo mostrar activos
    return String(empadronamiento.n_empadronamiento)
      .toLowerCase()
      .includes(buscarEmpadronamiento.toLowerCase()) && 
      (!mostrarDesactivados ? esActivo : esDesactivado); // Si mostrarDesactivados es true, mostrar desactivados
  });

  const handleUpdate = () => {
    const fetchEmpadronamientos = async () => {
      try {
        const empadronamientosData = await listarEmpadronamiento();
        setEmpadronamientos(empadronamientosData);
      } catch (error) {
        console.error('Error al obtener las asociaciones', error);
      }
    };
    fetchEmpadronamientos();
  };

  return (
    <div className="empadronamiento-container">
      <h2>Gestión de Empadronamientos</h2>
      
      <div className="empadronamiento-search-container">
        <input 
          type="text" 
          placeholder="Buscar N° Empadronamiento"
          value={buscarEmpadronamiento}
          onChange={(e) => setBuscarEmpadronamiento(e.target.value)} 
          className="empadronamiento-search-input"
        />
      </div>
      
      {/* Contenedor para los botones alineados en la misma línea */}
      <div className="empadronamiento-buttons-container">
        {/* Botón para alternar entre activos y desactivados */}
        <button 
          className="empadronamiento-button" 
          onClick={() => setMostrarDesactivados(!mostrarDesactivados)} // Alternar estado
        >
          {mostrarDesactivados ? "Mostrar activos" : "Mostrar desactivados"} {/* Cambiar texto del botón */}
        </button>

        {/* Botón para crear empadronamiento */}
        {(rol === "superadministrador" || rol === "administrador") && (
          <button 
            className="empadronamiento-button empadronamiento-button-create"
            onClick={() => { setModalIsOpen(true); setTipoModal('crear') }}
          >
            Crear Empadronamiento
          </button>
        )}
      </div>

      <EmpadronamientoTabla
        empradronamientos={filtroEmpadronamiento}
        onEdit={(id_empa) => {
          setEmpadronamientoId(id_empa);
          setTipoModal('editar');
          setModalIsOpen(true);
        }}
        onEstado={handleUpdate} 
      />

      {modalIsOpen && (
        <EmpadronamientoModal
          tipoModal={tipoModal}
          empadronamientoId={empadronamientoId}
          setModalIsOpen={setModalIsOpen}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default Empadronamiento;
