import { useState, useEffect } from "react"
import { listarEmpadronamiento } from "../services/empadronamiento"
import { getUserRoleFromToken } from "../utils/authHelper"
import EmpadronamientoModal from "../components/empadronamiento/EmpadronamientoModal"
import EmpadronamientoTabla from "../components/empadronamiento/EmpadronamientoTable"

const Empadronamiento = () => {
  const rol = getUserRoleFromToken();
  const [empadronamientos, setEmpadronamientos] = useState([]);
  const [tipoModal, setTipoModal] = useState('crear');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [empadronamientoId, setEmpadronamientoId] = useState(null);
  const [buscarEmpadronamiento, setBuscarEmpadronamiento] = useState('');

  useEffect(() => {
    const fetchEmpadronamientos = async () => {
      try {
        const empadronamientoData = await listarEmpadronamiento();
        setEmpadronamientos(empadronamientoData);
      } catch (error) {
        console.error('Error al obtener las asociaciones', error);
      };
    };
    fetchEmpadronamientos();
  }, []);
  const filtroEmpadronamiento = empadronamientos.filter((empadronamiento) =>
    String(empadronamiento.n_empadronamiento).toLowerCase().includes(buscarEmpadronamiento.toLowerCase())
  );
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
    <div>
      <h2>Gestión de Empadronamientos</h2>
      <div className="empadronamientos-seach-container">
        <input type="text" placeholder="Buscar N° Empadronamiento"
          value={buscarEmpadronamiento}
          onChange={(e) => setBuscarEmpadronamiento(e.target.value)} />
      </div>
      <div>
        {(rol === "superadministrador" || rol === "administrador") && (
          <button className="empadronamientos-button empadronamientos-button-create"
            onClick={() => { setModalIsOpen(true); setTipoModal('crear') }}>
            Crear Empadronamiento
          </button>
        )};
      </div>
      <EmpadronamientoTabla
        empradronamientos={filtroEmpadronamiento}
        onEdit={(id_empa) => {
          setEmpadronamientoId(id_empa);
          setTipoModal('editar');
          setModalIsOpen(true);
        }}
        onEstado={handleUpdate} />


      {modalIsOpen && (
        <EmpadronamientoModal
          tipoModal={tipoModal}
          empadronamientoId={empadronamientoId}
          setModalIsOpen={setModalIsOpen}
          onUpdate={handleUpdate}
        />
      )};
    </div>
  );
};

export default Empadronamiento