import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';  
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
import DashboardLayout from './layouts/DashboardLayout'; 
import { isAuthenticated } from './utils/authHelper'; // Función para comprobar si está autenticado
import Inicio from './pages/Inicio';

function App() {
  const navigate = useNavigate(); 

  useEffect(() => {
    // Si el usuario está autenticado, y está en la página de login (administracion), redirigir al dashboard
    if (isAuthenticated() && window.location.pathname === '/administracion') {
      navigate('/dashboard');  // Redirigir al dashboard si ya está autenticado
    }
  }, [navigate]);

  return (
    <div className="app-content">
      <Routes>
        {/* Página de inicio, se muestra por defecto */}
        <Route path="/inicio" element={<Inicio />} />

        {/* Ruta pública de login, solo accesible mediante /administracion */}
        <Route 
          path="/administracion" 
          element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />} 
        />

        {/* Rutas dentro del Dashboard con protección de roles */}
        <Route 
          path="/dashboard" 
          element={<PrivateRoute element={<DashboardLayout><Dashboard /></DashboardLayout>} />} 
        />
        <Route 
          path="/vehiculos" 
          element={<PrivateRoute element={<DashboardLayout><Vehiculos /></DashboardLayout>} />} 
        />
        <Route 
          path="/conductores" 
          element={<PrivateRoute element={<DashboardLayout><Conductores /></DashboardLayout>} />} 
        />
        <Route 
          path="/aseguradoras" 
          element={<PrivateRoute element={<DashboardLayout><Aseguradoras /></DashboardLayout>} />} 
        />
        <Route 
          path="/personas" 
          element={<PrivateRoute element={<DashboardLayout><Personas /></DashboardLayout>} />} 
        />
        <Route 
          path="/vehiculoseguros" 
          element={<PrivateRoute element={<DashboardLayout><VehiculosSeguros /></DashboardLayout>} />} 
        />
        <Route 
          path="/asociaciones" 
          element={<PrivateRoute element={<DashboardLayout><Asociaciones /></DashboardLayout>} />} 
        />
        <Route 
          path="/empadronamiento" 
          element={<PrivateRoute element={<DashboardLayout><Empadronamiento /></DashboardLayout>} />} 
        />
        <Route 
          path="/tuc" 
          element={<PrivateRoute element={<DashboardLayout><TUC /></DashboardLayout>} />} 
        />
        <Route 
          path="/micuenta" 
          element={<PrivateRoute element={<DashboardLayout><MiCuenta /></DashboardLayout>} />} 
        />

        {/* Ruta protegida solo por superadministrador y administrador */}
        <Route 
          path="/usuarios" 
          element={<PrivateRoute element={<DashboardLayout><Usuarios /></DashboardLayout>} roles={['superadministrador', 'administrador']} />} 
        />

        {/* Si no se encuentra la ruta, redirigir a /inicio */}
        <Route path="*" element={<Navigate to="/inicio" replace />} />
      </Routes>
    </div>
  );
}

export default App;
