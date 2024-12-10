import React, { useState, useEffect } from 'react'; // Agregar useEffect
import Sidebar from '../components/Sidebar';
import Swal from 'sweetalert2'; // Para SweetAlert2
import '../styles/dashboardLayout.css'; // Importamos los estilos del layout

const DashboardLayout = ({ children }) => {
    // Estado para manejar el colapso del sidebar
    const [collapsed, setCollapsed] = useState(false);

    // Función para mostrar la alerta
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

    // Función para alternar entre colapsado y expandido
    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    // Usar useEffect para mostrar la alerta al montar el componente
    useEffect(() => {
        // Verificar si el mensaje ya fue mostrado en esta sesión
        const hasVisited = sessionStorage.getItem('hasVisitedDashboard');

        // Si no se ha mostrado antes, mostrar la alerta
        if (!hasVisited) {
            showAlert();
            // Marcar en sessionStorage que ya se mostró el mensaje
            sessionStorage.setItem('hasVisitedDashboard', 'true');
        }
    }, []); // El array vacío asegura que solo se ejecute al montar el componente

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                <Sidebar collapsed={collapsed} /> {/* Barra lateral */}
                <button onClick={toggleSidebar} className="toggle-btn">
                    {collapsed ? '×' : '☰'} {/* Cambiar el icono del botón según el estado */}
                </button>
            </div>

            {/* Área de contenido a la derecha */}
            <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;
