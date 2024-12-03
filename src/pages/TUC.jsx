import { useState, useEffect } from 'react';
import { getUserRoleFromToken } from '../utils/authHelper';
import { listarTuc } from '../services/tuc';
import TucTabla from '../components/tuc/TucTable';
import TucModal from '../components/tuc/TucModal';
import '../styles/tuc.css';  // Asegúrate de importar el archivo SCSS

const TUC = () => {
  const rol = getUserRoleFromToken();
  const [tucs, setTucs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState('crear');
  const [tucId, setTucId] = useState(null);
  const [buscarPlaca, setBuscarPlaca] = useState('');
  const [buscarTuc, setBuscarTuc] = useState('');
  const [mostrarDesactivados, setMostrarDesactivados] = useState(false);

  useEffect(() => {
    const fetchTucs = async () => {
      try {
        const tucData = await listarTuc();
        setTucs(tucData);
      } catch (error) {
        console.error('Error al obtener informacion de TUC:', error);
      }
    };
    fetchTucs();
  }, []);

  // Filtrar por placa y número TUC
  const filtroPlaca = tucs.filter((tuc) => tuc.id_vehiculo.placa.toLowerCase().includes(buscarPlaca.toLowerCase()));
  const filtroTuc = tucs.filter((tuc) => String(tuc.n_tuc).toLowerCase().includes(buscarTuc.toLowerCase()));

  // Combina ambos filtros
  const tucsFiltrados = filtroPlaca.filter((tuc) =>
    filtroTuc.some((filteredTuc) => filteredTuc.id_tuc === tuc.id_tuc)
  );

  // Filtra los TUCs según el estado de activación
  const tucsActivosDesactivados = tucsFiltrados.filter((tuc) => 
    mostrarDesactivados ? tuc.estado === 0 : tuc.estado === 1
  );

  const handleUpdate = () => {
    const fetchTucs = async () => {
      try {
        const tucsData = await listarTuc();
        setTucs(tucsData);
      } catch (error) {
        console.error('Error al obtener datos de TUC:', error);
      }
    };
    fetchTucs();
  };

  return (
    <div className='tuc-page-container'>
      <h2 className='tuc-header'>Gestión de las tarjetas de circulación</h2>

      {/* Barra de búsqueda */}
      <div className='tuc-search-container'>
        <input 
          type="text"
          className='tuc-search-input'
          placeholder='Buscar por numero de placa'
          value={buscarPlaca}
          onChange={(e) => setBuscarPlaca(e.target.value)} 
        />
        <input 
          type="text"
          className='tuc-search-input'
          placeholder='Buscar por numero de Tuc'
          value={buscarTuc}
          onChange={(e) => setBuscarTuc(e.target.value)} 
        />
      </div>

      {/* Contenedor de los botones alineados en la misma línea */}
      <div className='tuc-button-container'>
        {/* Botón de crear nueva tarjeta */}
        {(rol === "superadministrador" || rol === "administrador") && (
          <button
            className="tuc-create-button"
            onClick={() => { setModalIsOpen(true); setTipoModal('crear'); }}
          >
            Crear Nueva Tarjeta de Circulación
          </button>
        )}

        {/* Botón de filtro activos/desactivados */}
        <button 
          className={`tuc-filter-button ${mostrarDesactivados ? 'active' : ''}`}
          onClick={() => setMostrarDesactivados(prevState => !prevState)}
        >
          {mostrarDesactivados ? 'Mostrar Activos' : 'Mostrar Desactivados'}
        </button>
      </div>

      {/* Tabla de TUCs */}
      <TucTabla
        tucs={tucsActivosDesactivados}
        onEdit={(id) => {
          setTucId(id);
          setTipoModal('editar');
          setModalIsOpen(true);
        }}
        onEstado={handleUpdate}
      />

      {/* Modal para crear o editar */}
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

export default TUC;
