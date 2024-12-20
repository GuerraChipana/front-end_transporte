// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { getUserRoleFromToken } from '../utils/authHelper';

const Sidebar = ({ collapsed }) => {
    const userRole = getUserRoleFromToken(); // Obtener el rol del usuario desde el token

    return (
        <div className={`sidebar-content ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <Link to="/dashboard">
                    <img src="escudo-icon.ico" alt="Logo" className="sidebar-logo" />
                </Link>
            </div>

            <ul>
                {userRole === 'superadministrador' || userRole === 'administrador' ? (
                    <li><Link to="/usuarios"><i className="fas fa-users-cog"></i> <span>{collapsed ? '' : 'Usuarios'}</span></Link></li>
                ) : null}
                <li><Link to="/personas"><i className="fas fa-users"></i> <span>{collapsed ? '' : 'Personas'}</span></Link></li>
                <li><Link to="/conductores"><i className="fas fa-user-tie"></i> <span>{collapsed ? '' : 'Conductores'}</span></Link></li>
                <li><Link to="/vehiculos"><i className="fas fa-car"></i> <span>{collapsed ? '' : 'Vehículos'}</span></Link></li>
                <li><Link to="/vehiculoseguros"><i className="fas fa-clipboard-list"></i> <span>{collapsed ? '' : 'Vehículos Seguros'}</span></Link></li>
                <li><Link to="/empadronamiento"><i className="fas fa-clipboard"></i> <span>{collapsed ? '' : 'Empadronamiento'}</span></Link></li>
                <li><Link to="/tuc"><i className="fas fa-address-card"></i> <span>{collapsed ? '' : 'TUC'}</span></Link></li>
                <li><Link to="/asociaciones"><i className="fas fa-handshake"></i> <span>{collapsed ? '' : 'Asociaciones'}</span></Link></li>
                <li><Link to="/aseguradoras"><i className="fas fa-shield-alt"></i> <span>{collapsed ? '' : 'Aseguradoras'}</span></Link></li>
                <li><Link to="/micuenta"><i className="fas fa-user"></i> <span>{collapsed ? '' : 'Mi Cuenta'}</span></Link></li>


                <li><button onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> <span>{collapsed ? '' : 'Cerrar sesión'}</span></button></li>
            </ul>
        </div>
    );
};

const handleLogout = () => {
    sessionStorage.removeItem('token'); // Eliminar el token de sesión
    sessionStorage.removeItem('hasVisitedDashboard'); // Eliminar la clave
    window.location.href = '/administracion'; // Redirigir al login
};


export default Sidebar;
