import React, { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import { listarUsuarios, cambiarEstadoUsuario, registrarUsuario, cambiarRolUsuario } from "../services/usuarios";
import "../styles/usuarios.css";  // Estilos específicos
import { getUserRoleFromToken } from "../utils/authHelper";
import Swal from 'sweetalert2';

const Usuarios = memo(() => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState({ isOpen: false, type: null, usuario: null });
  const [detalleBaja, setDetalleBaja] = useState("");
  const [formData, setFormData] = useState({
    nombre: "", apPaterno: "", apMaterno: "", dni: "", email: "", username: "", password: "", rol: "administrador",
  });

  const rolUsuarioActual = getUserRoleFromToken();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        cerrarModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const showSuccessMessage = (message) => {
    Swal.fire({
      title: 'Éxito!',
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      customClass: {
        title: 'alert-title',
        popup: 'alert-popup'
      }
    });
  };

  const showErrorMessage = (message) => {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      customClass: {
        title: 'alert-title',
        popup: 'alert-popup'
      }
    });
  };

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await listarUsuarios();
      setUsuarios(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = ({ target: { name, value } }) => {
    if (name === "dni" && !/^\d{0,8}$/.test(value)) { // Solo permite 8 dígitos numéricos
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmitUsuario = async (e) => {
    e.preventDefault();
    try {
      await registrarUsuario(formData);
      showSuccessMessage("Usuario creado exitosamente");
      cerrarModal();
      cargarUsuarios();
    } catch (error) {
      showErrorMessage("Error al crear el usuario.");
    }
  };

  const handleCambiarEstado = async (nuevoEstado) => {
    // Verificar si se está cambiando de activo a inactivo y el detalle de baja no está completo
    if (nuevoEstado === "0" && detalleBaja.length < 15) {
      showErrorMessage("El detalle de baja debe tener al menos 15 caracteres.");
      return;
    }
    try {
      const data = await cambiarEstadoUsuario(modalData.usuario.id_user, {
        estado: Number(nuevoEstado),
        detalle_baja: nuevoEstado === "0" ? detalleBaja : "",
      });

      setUsuarios(prev => prev.map(u => u.id_user === modalData.usuario.id_user ? data : u));
      showSuccessMessage("Estado cambiado exitosamente");
      cerrarModal();
    } catch (error) {
      showErrorMessage("Error al cambiar el estado del usuario.");
    }
  };

  const handleCambiarRol = async (id, nuevoRol) => {
    if (rolUsuarioActual === "administrador" && (nuevoRol === "superadministrador" || nuevoRol === "administrador")) {
      showErrorMessage("No tienes permisos para asignar este rol.");
      return;
    }
    try {
      await cambiarRolUsuario(id, nuevoRol);
      showSuccessMessage("Rol cambiado exitosamente");
      cerrarModal();
      cargarUsuarios();
    } catch (error) {
      showErrorMessage("Error al cambiar el rol del usuario.");
    }
  };

  const abrirModal = (type, usuario = null) => {
    setDetalleBaja("");
    setFormData(usuario || { nombre: "", apPaterno: "", apMaterno: "", dni: "", email: "", username: "", password: "", rol: "moderador" });
    setModalData({ isOpen: true, type, usuario });
  };

  const cerrarModal = () => {
    setModalData({ isOpen: false, type: null, usuario: null });
    setDetalleBaja("");
  };

  const renderModalContent = () => {
    const { type, usuario } = modalData;
    const rolesOptions = (rolUsuarioActual === "superadministrador")
      ? ["superadministrador", "administrador", "moderador", "asistente"]
      : (rolUsuarioActual === "administrador" ? ["moderador", "asistente"] : []);

    switch (type) {
      case "crear":
        return (
          <FormModal title="Crear Usuario" onClose={cerrarModal} modalClass="crear-usuario">
            <form onSubmit={handleSubmitUsuario}>
              {["nombres", "Apellido Paterno", "Apellido Materno", "DNI", "email", "username", "password"].map(field => (
                <InputField key={field} name={field} value={formData[field]} onChange={handleInputChange} required />
              ))}
              <SelectField name="rol" value={formData.rol} onChange={handleInputChange} options={rolesOptions} />
              <button type="submit" className="usuarios-btn usuarios-btn-success">Crear</button>
            </form>
          </FormModal>
        );
      case "cambiarRol":
        return (
          <FormModal title="Cambiar Rol" onClose={cerrarModal}>
            <form>
              <SelectField name="rol" value={formData.rol} onChange={handleInputChange} options={rolesOptions} />
              <button type="button" className="usuarios-btn usuarios-btn-warning" onClick={() => handleCambiarRol(usuario.id_user, formData.rol)}>Cambiar Rol</button>
            </form>
          </FormModal>
        );
      case "cambiarEstado":
        return (
          <FormModal title="Cambiar Estado" onClose={cerrarModal}>
            <p>{usuario.estado === 1 ? "Cambiar a Inactivo" : "Cambiar a Activo"}</p>
            {usuario.estado === 1 && (
              <textarea value={detalleBaja} onChange={e => setDetalleBaja(e.target.value)} placeholder="Detalle de baja (opcional)" minLength={15} required />
            )}
            <button className="usuarios-btn usuarios-btn-warning" onClick={() => handleCambiarEstado(usuario.estado === 1 ? "0" : "1")}>
              {usuario.estado === 1 ? "Desactivar" : "Activar"}
            </button>
          </FormModal>
        );
      default:
        return null;
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="usuarios-container">
      <h2>Lista de Usuarios</h2>
      <button className="usuarios-btn usuarios-btn-primary" onClick={() => abrirModal("crear")}>Crear Usuario</button>
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>ID</th><th>Nombres y Apellidos</th><th>Email</th><th>Rol</th><th>Acciones</th><th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id_user}>
              <td>{usuario.id_user}</td>
              <td>{`${usuario.nombre} ${usuario.apPaterno} ${usuario.apMaterno.charAt(0)}.`}</td>
              <td>{usuario.email}</td>
              <td>{usuario.rol}</td>
              <td>
                <button className="usuarios-btn usuarios-btn-info" onClick={() => abrirModal("cambiarRol", usuario)}>Cambiar Rol</button>
              </td>
              <td>
                <button className={`usuarios-btn ${usuario.estado ? "btn-success" : "btn-danger"}`} onClick={() => abrirModal("cambiarEstado", usuario)}>
                  {usuario.estado ? "Activo" : "Inactivo"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalData.isOpen && renderModalContent()}
    </div>
  );
});

Usuarios.propTypes = {};

export default Usuarios;

const FormModal = ({ title, children, onClose, modalClass = "" }) => (
  <div className="modal-container">
    <div className={`modal-content ${modalClass}`}>
      <div className="modal-header">
        <h5>{title}</h5>
        <button onClick={onClose}>&times;</button> {/* Close modal without submitting */}
      </div>
      <div className="modal-body">{children}</div>
    </div>
  </div>
);


const InputField = ({ name, value, onChange, required = false }) => (
  <div className="form-group">
    <label>{name.charAt(0).toUpperCase() + name.slice(1)}:</label>
    <input type="text" name={name} value={value} onChange={onChange} required={required}
      pattern={name === "dni" ? "^[0-9]{8}$" : ""} maxLength={name === "dni" ? 8 : undefined} />
  </div>
);

const SelectField = ({ name, value, onChange, options }) => (
  <div className="form-group">
    <label>{name.charAt(0).toUpperCase() + name.slice(1)}:</label>
    <select name={name} value={value} onChange={onChange}>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);
