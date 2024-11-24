// src/layouts/DashboardLayout.js
import React from 'react';
import Sidebar from '../components/Sidebar';
import Swal from 'sweetalert2'; // Para SweetAlert2
import '../styles/dashboardLayout.css'; // Importamos los estilos del layout

const DashboardLayout = ({ children }) => {

    // Función de ejemplo para mostrar una alerta
    const showAlert = () => {
        Swal.fire({
            title: getGreetingMessage(),
            icon: 'success',
        });
    };

    // Función para generar el mensaje de bienvenida dependiendo de la hora
    const getGreetingMessage = () => {
        const currentHour = new Date().getHours();
        if (currentHour >= 5 && currentHour < 12) {
            return "¡Buenos días! Bienvenido al sistema de transporte";
        } else if (currentHour >= 12 && currentHour < 18) {
            return "¡Buenas tardes! Bienvenido al sistema de transporte";
        } else {
            return "¡Buenas noches! Bienvenido al sistema de transporte";
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <div className="sidebar">
                <Sidebar /> {/* Barra lateral */}
            </div>

            {/* Área de contenido a la derecha */}
            <div className="main-content">
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;
