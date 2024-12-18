import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';  // No es necesario importar BrowserRouter aquí
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehiculos from './pages/Vehiculos';
import Conductores from './pages/Conductores';
import Aseguradoras from './pages/Aseguradoras';
import Personas from './pages/Personas';
import VehiculosSeguros from './pages/VehiculosSeguros';
import Asociaciones from './pages/Asociaciones';
import Empadronamiento from './pages/Empadronamiento';
import TUC from './pages/TUC';
import Usuarios from './pages/Usuarios';
import MiCuenta from './pages/MiCuenta';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './layouts/DashboardLayout'; // Layout que contiene Sidebar
import { isAuthenticated } from './utils/authHelper'; // Importamos la función isAuthenticated para comprobar el estado de autenticación

function App() {
  const navigate = useNavigate();  // Usamos el hook de navegación de React Router

  useEffect(() => {
    if (!isAuthenticated()) {
      // Si no está autenticado, redirige al login
      navigate('/login');
    }
  }, [navigate]);  // Dependencia de navigate para evitar que se repita innecesariamente


  return (
    <div className="app-content">
      <Routes>
        {/* Ruta pública de login */}
        <Route path="/login" element={<Login />} />

        {/* Rutas dentro del Dashboard con protección de roles */}
        <Route path="/dashboard" element={<PrivateRoute element={<DashboardLayout><Dashboard /></DashboardLayout>} />} />
        <Route path="/vehiculos" element={<PrivateRoute element={<DashboardLayout><Vehiculos /></DashboardLayout>} />} />
        <Route path="/conductores" element={<PrivateRoute element={<DashboardLayout><Conductores /></DashboardLayout>} />} />
        <Route path="/aseguradoras" element={<PrivateRoute element={<DashboardLayout><Aseguradoras /></DashboardLayout>} />} />
        <Route path="/personas" element={<PrivateRoute element={<DashboardLayout><Personas /></DashboardLayout>} />} />
        <Route path="/vehiculoseguros" element={<PrivateRoute element={<DashboardLayout><VehiculosSeguros /></DashboardLayout>} />} />
        <Route path="/asociaciones" element={<PrivateRoute element={<DashboardLayout><Asociaciones /></DashboardLayout>} />} />
        <Route path="/empadronamiento" element={<PrivateRoute element={<DashboardLayout><Empadronamiento /></DashboardLayout>} />} />
        <Route path="/tuc" element={<PrivateRoute element={<DashboardLayout><TUC /></DashboardLayout>} />} />
        <Route path="/micuenta" element={<PrivateRoute element={<DashboardLayout><MiCuenta /></DashboardLayout>} />} />

        {/* Ruta protegida solo por superadministrador y administrador */}
        <Route path="/usuarios" element={<PrivateRoute element={<DashboardLayout><Usuarios /></DashboardLayout>} roles={['superadministrador', 'administrador']} />} />

        {/* Redirigir a login si no se encuentra la ruta */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
