import { useState, useEffect } from 'react'
import { getUserRoleFromToken } from '../utils/authHelper'
import { listarTuc } from '../services/tuc'
import TucTabla from '../components/tuc/TucTable'
import TucModal from '../components/tuc/TucModal'

const TUC = () => {
  const rol = getUserRoleFromToken();
  const [tucs, setTucs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState('crear');
  const [tucId, setTucId] = useState(null);
  const [buscarPlaca, setBuscarPlaca] = useState('');
  const [buscarTuc, setBuscarTuc] = useState('');

  useEffect(() => {
    const fetchTucs = async () => {
      try {
        const tucData = await listarTuc();

        console.log(tucData);
        setTucs(tucData);
      } catch (error) {
        console.error('Error al obtener informacion de TUC:', error);
      };
    };
    fetchTucs();
  }, []);

  // filtro para buscar por placa y nuemor TUC
  const filtroPlaca = tucs.filter((tuc) => tuc.id_vehiculo.placa.toLowerCase().includes(buscarPlaca.toLowerCase()));
  const filtroTuc = tucs.filter((tuc) => String(tuc.n_tuc).toLowerCase().includes(buscarTuc.toLowerCase()));


  // Combina ambos filtros
  const tucsFiltrados = filtroPlaca.filter((tuc) =>
    filtroTuc.some((filteredTuc) => filteredTuc.id_tuc === tuc.id_tuc)
  );

  const handleUpdate = () => {
    const fetchTucs = async () => {

      try {
        const tucsData = await listarTuc();
        setTucs(tucsData);
      } catch (error) {
        console.error('Error al obtener datos de TUC:', error);
      };
    };
    fetchTucs();
  };
  return (
    <div className='tuc-container'>
      <h2>Gestion de las tarjetas de circulacion</h2>
      <div className='tuc-search-container'>
        <input type="text"
          placeholder='Buscar por numero de placa'
          value={buscarPlaca}
          onChange={(e) => setBuscarPlaca(e.target.value)} />
      </div>
      <div className='tuc-search-container'>
        <input type="text"
          placeholder='Buscar por numero de Tuc'
          value={buscarTuc}
          onChange={(e) => setBuscarTuc(e.target.value)} />
      </div>

      <div>
        {(rol === "superadministrador" || rol === "administrador") && (
          <button
            className="tuc-button tuc-button-create"
            onClick={() => { setModalIsOpen(true); setTipoModal('crear'); }}
          >
            Crear Nueva Tarjeta de Circulación
          </button>)}
      </div>
      <TucTabla
        tucs={tucsFiltrados}
        onEdit={(id) => {
          setTucId(id);
          setTipoModal('editar');
          setModalIsOpen(true);
        }}
        onEstado={handleUpdate}
      />



      {modalIsOpen && (
        <TucModal
          tipoModal={tipoModal}
          tucId={tucId}
          setModalIsOpen={setModalIsOpen}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};
export default TUC