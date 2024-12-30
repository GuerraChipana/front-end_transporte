import { useState, useEffect } from "react";
import { listarPersonas } from "../services/personas";
import { getUserRoleFromToken } from "../utils/authHelper";
import PersonasTable from "../components/personas/personasTable";
import PersonasModal from "../components/personas/PersonasModal";
import '../styles/personas.css'

const Personas = () => {
  const rol = getUserRoleFromToken();
  const [personas, setPersonas] = useState([]); // Inicializa como un arreglo vacío
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState("crear");
  const [personaId, setPersonaId] = useState(null);
  const [buscarDNI, setBuscarDNI] = useState("");
  const [mostrarActivos, setMostrarActivos] = useState(true);
  const [personaData, setPersonaData] = useState(null); // Para almacenar los datos de la persona seleccionada

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const personasData = await listarPersonas();
        setPersonas(personasData);
      } catch (error) {
        console.error("Error al obtener las personas", error);
      }
    };
    fetchPersonas();
  }, []);

  // Filtro de personas basado en el DNI y el estado
  const filtroPersonas = Array.isArray(personas)
    ? personas.filter(
      (persona) =>
        persona.dni.toLowerCase().includes(buscarDNI.toLowerCase()) &&
        (mostrarActivos ? persona.estado === 1 : persona.estado === 0)
    )
    : [];

  // Actualizar lista de personas después de creación o edición
  const handleUpdate = async () => {
    try {
      const personasData = await listarPersonas();
      setPersonas(personasData);
    } catch (error) {
      console.error("Error al obtener los datos", error);
    }
  };

  return (
    <div>
      <h2>Gestión de Personas</h2>

      <div className="personas-search-container">
        <input
          type="text"
          placeholder="Buscar por DNI"
          value={buscarDNI}
          onChange={(e) => setBuscarDNI(e.target.value)}
        />
      </div>

      <div className="personas-botones-container">
        <div className="personas-toggle-button-container">
          <button onClick={() => setMostrarActivos(!mostrarActivos)} className="personas-toggle-button">
            {mostrarActivos ? "Ver Inactivos" : "Ver Activos"}
          </button>
        </div>

        {(rol === "superadministrador" || rol === "administrador") && (
          <div className="personas-toggle-button-container">
            <button
              onClick={() => {
                setModalIsOpen(true);
                setTipoModal("crear");
                setPersonaData(null); // Resetear personaData para el modal de creación
              }}
              className="personas-button-create"
            >
              Crear Persona
            </button>
          </div>
        )}
      </div>

      <PersonasTable
        personas={filtroPersonas}
        onEdit={(id) => {
          const persona = personas.find((p) => p.id === id); // Buscar la persona por id
          setPersonaId(id);
          setPersonaData(persona); // Asignar los datos al modal para editar
          setTipoModal("editar");
          setModalIsOpen(true);
        }}
        OnEstado={handleUpdate}
      />

      {modalIsOpen && (
        <PersonasModal
          tipoModal={tipoModal}
          personaId={personaId}
          setModalIsOpen={setModalIsOpen}
          onUpdate={handleUpdate}
          personaData={personaData} // Pasa personaData para editar
        />
      )}
    </div>

  );
};

export default Personas;
