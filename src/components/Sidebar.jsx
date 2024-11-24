// src/components/Sidebar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserRoleFromToken } from '../utils/authHelper'; // Asegúrate de importar la función

// Función para cerrar sesión
const handleLogout = () => {
    sessionStorage.removeItem('token'); // Eliminar el token de sesión
    window.location.href = '/login'; // Redirigir al login
};

const Sidebar = () => {
    const userRole = getUserRoleFromToken(); // Obtener el rol del usuario desde el token
    const navigate = useNavigate(); // Usar el hook navigate para redirección programática

    return (
        <div className="sidebar">
            <h2>Sidebar</h2>
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/vehiculos">Vehículos</Link></li>
                <li><Link to="/conductores">Conductores</Link></li>
                <li><Link to="/aseguradoras">Aseguradoras</Link></li>
                <li><Link to="/personas">Personas</Link></li>
                <li><Link to="/vehiculoseguros">Vehículos Seguros</Link></li>
                <li><Link to="/asociaciones">Asociaciones</Link></li>
                <li><Link to="/empadronamiento">Empadronamiento</Link></li>
                <li><Link to="/tuc">TUC</Link></li>
                <li><Link to="/micuenta">Mi Cuenta</Link></li>

                {/* Solo muestra el enlace de 'Usuarios' si el rol es 'superadministrador' o 'administrador' */}
                {userRole === 'superadministrador' || userRole === 'administrador' ? (
                    <li><Link to="/usuarios">Usuarios</Link></li>
                ) : null}

                {/* Enlace para cerrar sesión */}
                <li><button onClick={handleLogout}>Cerrar sesión</button></li>
            </ul>
        </div>
    );
};

export default Sidebar;
