import { useState, useEffect } from "react"
import { listarAsociaciones } from "../services/asociaciones"
import { getUserRoleFromToken } from "../utils/authHelper"
import AsociacionTabla from "../components/asociaciones/AsociacionTable"
import AsociacionModal from "../components/asociaciones/AsociacionModal"
const Asociaciones = () => {
  const rol = getUserRoleFromToken();
  const [asociaciones, setAsociaciones] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState('crear');
  const [asociacionId, setAsociacionId] = useState(null);
  const [bucarAsociacion, setBuscarAsociacion] = useState('');

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

  const filtroAsociacion = asociaciones.filter((asociacion) =>
    (asociacion.nombre).toLowerCase().includes(bucarAsociacion.toLowerCase())
  );

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

  return (
    <div className="asoaciones-gestion-container">
      <h2>Gestión de Asociaciones</h2>
      <div className="asociaciones-seach-container">
        <input type="text" placeholder="Buscar Asociación"
          value={bucarAsociacion}
          onChange={(e) => setBuscarAsociacion(e.target.value)} />
      </div>
      <div>
        {(rol === "superadministrador" || rol === "administrador") && (
          <button className="asociaciones-button asociaciones-button-create"
            onClick={() => { setModalIsOpen(true); setTipoModal('crear') }}>
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
