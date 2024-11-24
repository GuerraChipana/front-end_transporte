// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRoleFromToken } from '../utils/authHelper';

const PrivateRoute = ({ element: Component, roles, ...rest }) => {
  const isAuth = isAuthenticated();
  const userRole = getUserRoleFromToken();

  if (!isAuth) {
    // Si no está autenticado, redirige al login
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(userRole)) {
    // Si el usuario no tiene el rol adecuado, redirige al dashboard
    return <Navigate to="/dashboard" />;
  }

  // Si el usuario está autenticado y tiene el rol adecuado, renderiza el componente
  return Component;
};

export default PrivateRoute;
