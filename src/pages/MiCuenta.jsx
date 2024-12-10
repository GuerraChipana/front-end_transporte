import React, { PureComponent } from 'react';
import { cambiarCredencialesUsuario } from '../services/usuarios';
import { cuenta } from '../services/auth';
import { getUserRoleFromToken } from '../utils/authHelper';
import '../styles/miCuenta.css';

// Iconos por rol usando Font Awesome
const roleIcons = {
  superadministrador: 'fas fa-crown',
  administrador: 'fas fa-tools',
  asistente: 'fas fa-laptop-code',
  moderador: 'fas fa-pencil-alt',
};

export default class MiCuenta extends PureComponent {
  state = {
    username: '',
    email: '',  // Este campo está vacío inicialmente para que el usuario pueda escribir un nuevo correo
    password_actual: '',
    password_nueva: '',
    confirmacion_password: '',
    mensajeError: '',
    mensajeExito: '',
    datosCuenta: null,
    cambiarPassword: false,
    errores: {
      username: '',
      email: '',
      password_actual: '',
      password_nueva: '',
      confirmacion_password: '',
    },
  };


  // Cargar los datos de la cuenta al montar el componente
  async componentDidMount() {
    try {
      const datosCuenta = await cuenta(); // Llamamos a la API para obtener los datos del usuario
      if (datosCuenta) {
        this.setState({
          datosCuenta,
          username: datosCuenta.username || '',
          email: datosCuenta.email || '',
        });
      } else {
        this.setState({ mensajeError: 'No se pudieron cargar los datos de la cuenta.' });
      }
    } catch (error) {
      this.setState({ mensajeError: 'Error al cargar los datos de la cuenta.' });
      console.error('Error al cargar los datos de la cuenta:', error);
    }
  }

  // Validaciones en tiempo real
  validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'username':
        if (!value) error = 'El nombre de usuario es requerido';
        break;
      case 'email':
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!value) error = 'El correo electrónico es requerido';
        else if (!emailPattern.test(value)) error = 'Por favor ingrese un correo electrónico válido';
        break;
      case 'password_actual':
        if (!value) error = 'La contraseña actual es requerida';
        break;
      case 'password_nueva':
        if (value && value.length < 6) error = 'La nueva contraseña debe tener al menos 6 caracteres';
        break;
      case 'confirmacion_password':
        if (value && value !== this.state.password_nueva) error = 'Las contraseñas no coinciden';
        break;
      default:
        break;
    }

    this.setState(prevState => ({
      errores: { ...prevState.errores, [name]: error },
    }));
  };

  // Manejar cambios en el formulario
  handleChange = (e) => {
    const { name, value } = e.target;

    // Validación en tiempo real para el nuevo nombre de usuario (mínimo 5 caracteres)
    if (name === 'username' && value.length < 5) {
      this.setState(prevState => ({
        errores: {
          ...prevState.errores,
          username: 'El nombre de usuario debe tener al menos 5 caracteres.',
        }
      }));
    } else {
      this.setState(prevState => ({
        errores: {
          ...prevState.errores,
          username: '',
        }
      }));
    }
    // Validación en tiempo real para la nueva contraseña (mínimo 5 caracteres)
    if (name === 'password_nueva' && value.length < 5) {
      this.setState(prevState => ({
        errores: {
          ...prevState.errores,
          password_nueva: 'La contraseña debe tener al menos 5 caracteres.',
        }
      }));
    } else {
      this.setState(prevState => ({
        errores: {
          ...prevState.errores,
          password_nueva: '',
        }
      }));
    }
    // Actualiza el valor del campo
    this.setState({ [name]: value });
  };

  // Enviar el formulario
  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password_actual, password_nueva, confirmacion_password, errores } = this.state;

    // Verificamos si hay errores antes de enviar el formulario
    if (Object.values(errores).some(err => err)) {
      this.setState({ mensajeError: 'Por favor corrige los errores antes de enviar el formulario.' });
      return;
    }

    const credenciales = {
      username,
      email,
      password_actual,
      password_nueva,
      confirmacion_password,
    };

    try {
      const response = await cambiarCredencialesUsuario(credenciales);
      this.setState({ mensajeExito: 'Credenciales actualizadas exitosamente', mensajeError: '' });
    } catch (error) {
      this.setState({ mensajeError: 'Hubo un error al actualizar las credenciales' });
    }
  };

  toggleChangePassword = () => {
    this.setState((prevState) => ({
      cambiarPassword: !prevState.cambiarPassword,
    }));
  };

  render() {
    const {
      username,
      email,
      password_actual,
      password_nueva,
      confirmacion_password,
      mensajeError,
      mensajeExito,
      datosCuenta,
      cambiarPassword,
      errores,
    } = this.state;

    const userRole = datosCuenta ? datosCuenta.rol : getUserRoleFromToken();

    return (
      <div className="mi-cuenta-container">
        <div className="mi-cuenta-left">
          <h2>Cambiar Credenciales</h2>
          <form onSubmit={this.handleSubmit} className="formulario">
            <div className="form-group">
              <label>Nuevo Nombre de Usuario</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={this.handleChange}
                placeholder="Nuevo nombre de usuario"
                required
              />
              {errores.username && <p className="error-message">{errores.username}</p>}
            </div>
            <div className="form-group">
              <label>Nuevo Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={this.handleChange}
                placeholder="Nuevo correo electrónico"
                required
              />
              {errores.email && <p className="error-message">{errores.email}</p>}
            </div>

            <div className="form-group">
              <label>Contraseña Actual</label>
              <input
                type="password"
                name="password_actual"
                value={password_actual}
                onChange={this.handleChange}
                placeholder="Contraseña actual"
                required
              />
              {errores.password_actual && <p className="error-message">{errores.password_actual}</p>}
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={cambiarPassword}
                  onChange={this.toggleChangePassword}
                />
                Cambiar Contraseña
              </label>
            </div>

            {cambiarPassword && (
              <>
                <div className="form-group">
                  <label>Contraseña Nueva</label>
                  <input
                    type="password"
                    name="password_nueva"
                    value={password_nueva}
                    onChange={this.handleChange}
                    placeholder="Nueva contraseña"
                  />
                  {errores.password_nueva && <p className="error-message">{errores.password_nueva}</p>}
                </div>
                <div className="form-group">
                  <label>Confirmar Contraseña</label>
                  <input
                    type="password"
                    name="confirmacion_password"
                    value={confirmacion_password}
                    onChange={this.handleChange}
                    placeholder="Confirmar nueva contraseña"
                  />
                  {errores.confirmacion_password && <p className="error-message">{errores.confirmacion_password}</p>}
                </div>
              </>
            )}

            {mensajeError && <p className="error-message">{mensajeError}</p>}
            {mensajeExito && <p className="success-message">{mensajeExito}</p>}
            <button type="submit" className="submit-button">Actualizar Credenciales</button>
          </form>
        </div>

        <div className="mi-cuenta-right">
          <h2>Datos de la Cuenta</h2>
          {datosCuenta ? (
            <div className="cuenta-data">
              <p>
                <strong>Rol:</strong> <i className={roleIcons[userRole] || 'fas fa-question-circle'}></i> {userRole}
              </p>
              <p><strong>Nombres:</strong> {datosCuenta.nombre}</p>
              <p><strong>Apellidos:</strong> {datosCuenta.apPaterno} {datosCuenta.apMaterno}</p>
              <p><strong>Email:</strong> {datosCuenta.email}</p>
              <p><strong>Rol:</strong> {datosCuenta.rol}</p>
            </div>
          ) : (
            <p>Cargando los datos de tu cuenta...</p>
          )}
        </div>
      </div>
    );
  }
}
