import React, { useState, useEffect } from 'react';
import AseguradoraTabla from '../components/aseguradoras/aseguradoraTable';
import { listarAseguradoras } from '../services/aseguradoras';
import { getUserRoleFromToken } from '../utils/authHelper';
import AseguradoraModal from '../components/aseguradoras/aseguradoraModal';
import '../styles/Aseguradora.css';

const Aseguradoras = () => {
  const [aseguradoras, setAseguradoras] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState("crear");
  const [aseguradoraId, setAseguradoraId] = useState(null);
  const [buscarNombre, setBuscarNombre] = useState("");
  const rol = getUserRoleFromToken();

  useEffect(() => {
    const fetchAseguradora = async () => {
      try {
        const aseguradoraData = await listarAseguradoras();
        setAseguradoras(aseguradoraData);
      } catch (error) {
        console.error("Error al obtener las aseguradoras:", error);
      }
    };
    fetchAseguradora();
  }, []);

  const filtroAseguradora = aseguradoras.filter((aseguradora) =>
    aseguradora.aseguradora.toLowerCase().includes(buscarNombre.toLowerCase())
  );

  const handleUpdate = () => {
    const fetchAseguradora = async () => {
      try {
        const aseguradoraData = await listarAseguradoras();
        setAseguradoras(aseguradoraData);
      } catch (error) {
        console.error("Error al obtener las aseguradoras:", error);
      }
    };
    fetchAseguradora();
  };

  return (
    <div className="aseguradora-gestion-container">
      <h2>Gestión de Aseguradoras</h2>

      <div className="aseguradora-search-container">
        <input
          type="text"
          placeholder="Buscar por Nombre"
          value={buscarNombre}
          onChange={(e) => setBuscarNombre(e.target.value)}
        />
      </div>

      {(rol === "superadministrador" || rol === "administrador") && (
        <div>
          <button className="aseguradora-button aseguradora-button-create" onClick={() => { setModalIsOpen(true); setTipoModal("crear"); }}>
            Crear Aseguradora</button>
        </div>
      )}
      <AseguradoraTabla
        aseguradoras={filtroAseguradora}
        onEdit={(id) => {
          setAseguradoraId(id);
          setTipoModal("editar");
          setModalIsOpen(true);
        }}
        onChangeState={handleUpdate}
      />

      {modalIsOpen && (
        <AseguradoraModal
          tipoModal={tipoModal}
          aseguradoraId={aseguradoraId}
          setModalIsOpen={setModalIsOpen}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default Aseguradoras;
