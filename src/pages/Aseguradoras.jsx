import React, { useState, useEffect } from 'react';
import AseguradoraTabla from '../components/aseguradoras/aseguradoraTable';
import { listarAseguradoras } from '../services/aseguradoras';
import { getUserRoleFromToken } from '../utils/authHelper';
import AseguradoraModal from '../components/aseguradoras/aseguradoraModal';
import '../styles/Aseguradora.css';

const Aseguradoras = () => {
  const [aseguradoras, setAseguradoras] = useState([]); // Inicializamos como un array vacío
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState("crear");
  const [aseguradoraId, setAseguradoraId] = useState(null);
  const [buscarNombre, setBuscarNombre] = useState("");
  const rol = getUserRoleFromToken();

  useEffect(() => {
    const fetchAseguradora = async () => {
      try {
        const aseguradoraData = await listarAseguradoras();

        // Verificamos que la respuesta sea un array
        if (Array.isArray(aseguradoraData)) {
          setAseguradoras(aseguradoraData); // Si es un array, lo seteamos
        } else {
          console.error("Error: la respuesta no es un array", aseguradoraData);
          setAseguradoras([]); // Establecemos un array vacío en caso de error
        }
      } catch (error) {
        console.error("Error al obtener las aseguradoras:", error);
        setAseguradoras([]); // En caso de error, establecemos un array vacío
      }
    };
    fetchAseguradora();
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  // Filtro de aseguradoras
  const filtroAseguradora = aseguradoras.filter((aseguradora) =>
    aseguradora.aseguradora.toLowerCase().includes(buscarNombre.toLowerCase())
  );

  const handleUpdate = () => {
    const fetchAseguradora = async () => {
      try {
        const aseguradoraData = await listarAseguradoras();
        // Verificamos que la respuesta sea un array
        if (Array.isArray(aseguradoraData)) {
          setAseguradoras(aseguradoraData);
        } else {
          console.error("Error: la respuesta no es un array", aseguradoraData);
        }
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
          <button
            className="aseguradora-button aseguradora-button-create"
            onClick={() => {
              setModalIsOpen(true);
              setTipoModal("crear");
            }}
          >
            Crear Aseguradora
          </button>
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
