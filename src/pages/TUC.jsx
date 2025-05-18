import { useState, useEffect } from "react";
import { listarTuc } from "../services/tuc"; // Asegúrate de tener la función listarTuc correctamente importada
import { getUserRoleFromToken } from "../utils/authHelper";
import TucTabla from "../components/tuc/TucTable";
import TucModal from "../components/tuc/TucModal";
import "../styles/tuc.css";

const TUC = () => {
  const rol = getUserRoleFromToken();
  const [tucs, setTucs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState("crear");
  const [tucId, setTucId] = useState(null);
  const [buscarPlaca, setBuscarPlaca] = useState("");
  const [buscarTuc, setBuscarTuc] = useState("");
  const [mostrarDesactivados, setMostrarDesactivados] = useState(false);
  const [filtroAno, setFiltroAno] = useState("");  // Filtro de año

  useEffect(() => {
    const fetchTucs = async () => {
      try {
        const tucData = await listarTuc();
        setTucs(tucData);
      } catch (error) {
        console.error("Error al obtener informacion de TUC:", error);
      }
    };
    fetchTucs();
  }, []);

  // Filtrar por placa y número TUC
  const filtroPlaca = tucs.filter((tuc) =>
    tuc.id_vehiculo.placa.toLowerCase().includes(buscarPlaca.toLowerCase())
  );

  const filtroTuc = filtroPlaca.filter((tuc) =>
    String(tuc.n_tuc).toLowerCase().includes(buscarTuc.toLowerCase())
  );

  // Filtrar por año
  const filtroAnoSeleccionado = filtroTuc.filter((tuc) => {
    return filtroAno ? tuc.ano_tuc === parseInt(filtroAno) : true; // Aseguramos que el año sea un número
  });

  // Filtrar según estado de activación (activos/desactivados)
  const tucsFiltrados = filtroAnoSeleccionado.filter((tuc) =>
    mostrarDesactivados ? tuc.estado === 0 : tuc.estado === 1
  );

  const handleUpdate = () => {
    const fetchTucs = async () => {
      try {
        const tucsData = await listarTuc();
        setTucs(tucsData);
      } catch (error) {
        console.error("Error al obtener datos de TUC:", error);
      }
    };
    fetchTucs();
  };

  // Obtener una lista de años únicos para el filtro
  const añosUnicos = [...new Set(tucs.map((tuc) => tuc.ano_tuc))];

  return (
    <div className="tuc-page-container">
      <h2 className="tuc-header">Gestión de las tarjetas de circulación</h2>

      {/* Barra de búsqueda */}
      <div className="tuc-search-container">
        <input
          type="text"
          className="tuc-search-input"
          placeholder="Buscar por número de placa"
          value={buscarPlaca}
          onChange={(e) => setBuscarPlaca(e.target.value)}
        />
        <input
          type="text"
          className="tuc-search-input"
          placeholder="Buscar por número de Tuc"
          value={buscarTuc}
          onChange={(e) => setBuscarTuc(e.target.value)}
        />
        {/* Filtro de Año */}
        <div className="tuc-filter-container">
          <label htmlFor="filtroAno">Filtrar por Año:</label>
          <select
            id="filtroAno"
            className="tuc-filter-select"
            value={filtroAno}
            onChange={(e) => setFiltroAno(e.target.value)}
          >
            <option value="">Todos</option>
            {añosUnicos.map((ano) => (
              <option key={ano} value={ano}>
                {ano}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contenedor de los botones alineados en la misma línea */}
      <div className="tuc-button-container">
        {/* Botón de crear nueva tarjeta */}
        {(rol === "superadministrador" || rol === "administrador") && (
          <button
            className="tuc-create-button"
            onClick={() => {
              setModalIsOpen(true);
              setTipoModal("crear");
            }}
          >
            Crear Nueva Tarjeta de Circulación
          </button>
        )}

        {/* Botón de filtro activos/desactivados */}
        <button
          className={`tuc-filter-button ${mostrarDesactivados ? "active" : ""}`}
          onClick={() => setMostrarDesactivados((prevState) => !prevState)}
        >
          {mostrarDesactivados ? "Mostrar Activos" : "Mostrar Desactivados"}
        </button>
      </div>

      {/* Tabla de TUCs */}
      <TucTabla
        tucs={tucsFiltrados}
        onEdit={(id) => {
          setTucId(id);
          setTipoModal("editar");
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
