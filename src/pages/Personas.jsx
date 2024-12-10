import React, { useEffect, useState } from 'react';
import { listarPersonas, actualizarPersona, cambiarEstadoPersona, registrarPersona } from '../services/personas';
import { getUserRoleFromToken } from "../utils/authHelper";
import '../styles/personas.css'

const Personas = () => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [nuevaPersona, setNuevaPersona] = useState({ dni: '', telefono: '', email: '', password_consulta: '' });
  const [errorRegistro, setErrorRegistro] = useState(null);
  const [isRegistroOpen, setIsRegistroOpen] = useState(false);
  const [dniBuscar, setDniBuscar] = useState(''); // Estado para la búsqueda por DNI

  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [recordsPerPage] = useState(25); // Número de registros por página

  const rolUsuario = getUserRoleFromToken();

  const fetchPersonas = async () => {
    try {
      const data = await listarPersonas();
      setPersonas(data);
    } catch (err) {
      setError("Error al obtener la lista de personas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  const filtrarDatosSegunRol = (persona) => {
    const { id, dni, nombre, apPaterno, apMaterno, telefono, foto, email, domicilio } = persona;
    return rolUsuario === 'superadministrador' || rolUsuario === 'administrador'
      ? { id, dni, nombre, apPaterno, apMaterno, telefono, foto, email, domicilio }
      : { id, dni, nombre, apPaterno, apMaterno, telefono, foto, email };
  };

  const handleAction = async (action, params) => {
    try {
      await action(params);
      fetchPersonas();
    } catch (error) {
      console.error(`Error en la acción ${action.name}`, error);
      if (error.response && error.response.data) {
        setErrorRegistro(error.response.data.message);
      }
    }
  };

  // Manejo de actualización de persona (solo telefono, email, domicilio)
  const handleEditarPersona = async () => {
    const personaData = {
      telefono: personaSeleccionada.telefono,
      email: personaSeleccionada.email,
      domicilio: personaSeleccionada.domicilio,
    };

    // Si el email está vacío, no incluirlo en los datos enviados
    if (!personaSeleccionada.email) {
      delete personaData.email;
    }

    try {
      await actualizarPersona(personaSeleccionada.id, personaData);
      fetchPersonas();
      setPersonaSeleccionada(null);
    } catch (error) {
      console.error("Error al editar la persona", error);
      if (error.response && error.response.data) {
        setErrorRegistro(error.response.data.message);
      }
    }
  };


  const handleCambiarEstado = async (personaId, nuevoEstado) => {
    const detalleBaja = nuevoEstado === 0 ? prompt("Indique el motivo de baja (mínimo 15 caracteres):") : "";
    const estadoData = {
      estado: nuevoEstado,
      detalle_baja: detalleBaja,
    };
    try {
      await cambiarEstadoPersona(personaId, estadoData);
      fetchPersonas();
    } catch (error) {
      console.error("Error al cambiar el estado de la persona", error);
      if (error.response && error.response.data) {
        setErrorRegistro(error.response.data.message);
      }
    }
  };

  const handleRegistrarPersona = async (e) => {
    e.preventDefault();
    // Crear el objeto de datos, verificando si el email está vacío
    const personaData = {
      dni: nuevaPersona.dni,
      telefono: nuevaPersona.telefono,
      password_consulta: nuevaPersona.password_consulta,
    };

    // Si el email no está vacío, agregarlo al objeto
    if (nuevaPersona.email) {
      personaData.email = nuevaPersona.email;
    }

    try {
      await registrarPersona(personaData);
      fetchPersonas();
      setIsRegistroOpen(false);
      setNuevaPersona({ dni: '', telefono: '', email: '', password_consulta: '' });
      alert("Persona registrada correctamente");
    } catch (error) {
      console.error("Error al registrar persona", error);
      if (error.response && error.response.data) {
        setErrorRegistro(error.response.data.message);
      }
    }
  };


  const handleSearch = (e) => {
    setDniBuscar(e.target.value);
  };

  const personasFiltradas = personas.filter((persona) =>
    persona.dni.includes(dniBuscar)
  );

  // Paginación: Obtener las personas correspondientes a la página actual
  const indexOfLastPerson = currentPage * recordsPerPage;
  const indexOfFirstPerson = indexOfLastPerson - recordsPerPage;
  const personasPaginadas = personasFiltradas.slice(indexOfFirstPerson, indexOfLastPerson);

  const totalPages = Math.ceil(personasFiltradas.length / recordsPerPage); // Número total de páginas

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderFormularioRegistro = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Registrar Persona</h2>
        {errorRegistro && <p style={{ color: 'red' }}>{errorRegistro}</p>}
        <form onSubmit={handleRegistrarPersona}>
          <input
            type="text"
            value={nuevaPersona.dni}
            onChange={(e) => setNuevaPersona({ ...nuevaPersona, dni: e.target.value })}
            placeholder="DNI"
            required
          />
          <input
            type="text"
            value={nuevaPersona.telefono}
            onChange={(e) => setNuevaPersona({ ...nuevaPersona, telefono: e.target.value })}
            placeholder="Teléfono"
            required
          />
          <input
            type="email"
            value={nuevaPersona.email}
            onChange={(e) => setNuevaPersona({ ...nuevaPersona, email: e.target.value })}
            placeholder="Email"
          />
          <input
            type="password"
            value={nuevaPersona.password_consulta}
            onChange={(e) => setNuevaPersona({ ...nuevaPersona, password_consulta: e.target.value })}
            placeholder="Contraseña de consulta"
            required
          />
          <div className='personas-container-button-acepp'>
            <button type="submit">Registrar</button>
            <button type="button" onClick={() => setIsRegistroOpen(false)}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderFormularioEdicion = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Persona</h2>
        {errorRegistro && <p style={{ color: 'red' }}>{errorRegistro}</p>}
        <form onSubmit={handleEditarPersona}>
          <input
            type="text"
            value={personaSeleccionada.telefono}
            onChange={(e) => setPersonaSeleccionada({ ...personaSeleccionada, telefono: e.target.value })}
            placeholder="Teléfono"
            required
          />
          <input
            type="email"
            value={personaSeleccionada.email}
            onChange={(e) => setPersonaSeleccionada({ ...personaSeleccionada, email: e.target.value })}
            placeholder="Email"
          />
          <input
            type="text"
            value={personaSeleccionada.domicilio}
            onChange={(e) => setPersonaSeleccionada({ ...personaSeleccionada, domicilio: e.target.value })}
            placeholder="Domicilio"
            required
          />
          <div className='personas-container-button-acepp'>
            <button type="submit">Guardar Cambios</button>
            <button type="button" onClick={() => setPersonaSeleccionada(null)}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="personas-container">
      <h1>Gestión de Personas </h1>
      <div className="search-register-container">
        <div className="search-container">
          <input
            type="text"
            value={dniBuscar}
            onChange={handleSearch}
            placeholder="Buscar por DNI"
          />
        </div>

        {(rolUsuario === 'superadministrador' || rolUsuario === 'administrador') && (
          <button onClick={() => setIsRegistroOpen(true)}>Registrar Persona</button>
        )}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              {['ID', 'DNI', 'Nombres y Apellidos', 'Teléfono', 'Email', 'Foto'].map((header) => (
                <th key={header}>{header}</th>
              ))}
              {(rolUsuario === 'superadministrador' || rolUsuario === 'administrador') && (
                <>
                  <th>Domicilio</th>
                  <th>Acciones</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {personasPaginadas.map((persona) => {
              const personaFiltrada = filtrarDatosSegunRol(persona);
              return (
                <tr key={persona.id}>
                  <td>{personaFiltrada.id}</td>
                  <td>{personaFiltrada.dni}</td>
                  <td>{`${personaFiltrada.nombre} ${personaFiltrada.apPaterno} ${personaFiltrada.apMaterno.charAt(0)}.`}</td>
                  <td>{personaFiltrada.telefono}</td>
                  <td>{personaFiltrada.email}</td>
                  <td>
                    <img
                      src={personaFiltrada.foto}
                      alt={`Foto de ${personaFiltrada.nombre}`}
                      style={{ width: '50px', height: '55px', borderRadius: '25%' }}
                    />
                  </td>
                  {(rolUsuario === 'superadministrador' || rolUsuario === 'administrador') && (
                    <>
                      <td>{persona.domicilio}</td>
                      <td>
                        <button onClick={() => setPersonaSeleccionada(persona)}>Editar</button>
                        <button
                          className={persona.estado === 1 ? 'btn-activar' : 'btn-desactivar'}
                          onClick={() => handleCambiarEstado(persona.id, persona.estado === 1 ? 0 : 1)}
                        >
                          {persona.estado === 1 ? 'Desactivar' : 'Activar'}
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>

      {isRegistroOpen && renderFormularioRegistro()}
      {personaSeleccionada && renderFormularioEdicion()}
    </div>
  );
};

export default Personas;
