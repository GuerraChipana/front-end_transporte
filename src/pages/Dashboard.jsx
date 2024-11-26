import React, { useEffect, useState } from 'react';
import { getWelcomeInfo } from '../services/auth';
import '../styles/dashboard.css';  // Importa los estilos específicos para el Dashboard

const Dashboard = () => {
  // Estado y lógica de carga
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWelcomeInfo = async () => {
      try {
        setLoading(true);
        const info = await getWelcomeInfo();
        setUserInfo(info);
        setError(null);
      } catch (err) {
        setError(err.message);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWelcomeInfo();
  }, []);

  // Renderiza la vista según el estado
  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!userInfo) return <div className="no-user">No se pudo obtener la información del usuario.</div>;

  // Función para obtener el icono del rol
  const getRoleIcon = (role) => {
    switch (role) {
      case 'superadministrador':
        return 'fas fa-crown';
      case 'administrador':
        return 'fas fa-user-shield';
      case 'moderador':
        return 'fas fa-user-edit';
      case 'asistente':
        return 'fas fa-users';
      default:
        return 'fas fa-user';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-section">
        {/* Cabecera de bienvenida */}
        <h1 className="dashboard-title">Control de Transporte y Gestión Municipal</h1>

        {/* Sección de Usuario y Información Institucional */}
        <div className="user-institution-info">
          {/* Información del usuario (izquierda) */}
          <div className="user-info">
            <div className="user-detail">
              <i className={getRoleIcon(userInfo.rol)}></i>
              <p><strong>Nombre:</strong> {userInfo.nombre} {userInfo.apPaterno}</p>
              <p><strong>Rol:</strong> {userInfo.rol}</p>
            </div>
          </div>

          {/* Información Institucional (derecha) */}
          <section className="institution-info">
            <h3>Información Institucional</h3>
            <ul>
              <li><strong>Razón Social:</strong> Municipalidad Distrital de Tupac Amaru Inca</li>
              <li><strong>Fecha de Inicio de Actividades:</strong> 01/07/1993</li>
              <li><strong>Tipo de Empresa:</strong> Gobierno Local</li>
              <li><strong>Actividad Comercial:</strong> Administración Pública en General</li>
              <li><strong>Ubicación:</strong> Ica / Pisco / Tupac Amaru Inca</li>
              <li><strong>Contacto:</strong> <a href="http://www.munitai.gob.pe/web" target="_blank" rel="noopener noreferrer">www.munitai.gob.pe/web</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
