// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { getWelcomeInfo } from '../services/auth';

const Dashboard = () => {
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

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userInfo) return <div>No se pudo obtener la información del usuario.</div>;

  return (
    <div>
      <h2>Bienvenido, {userInfo.nombre} {userInfo.apPaterno}</h2>
      <p>Rol: {userInfo.rol}</p>
    </div>
  );
};

export default Dashboard;
