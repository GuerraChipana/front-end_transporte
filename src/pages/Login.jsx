// pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Cambiado a useNavigate
import { login } from '../services/auth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Usamos useNavigate en lugar de useHistory

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await login(username, password); 
      if (token) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Nombre de usuario"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
        {error && <div>{error}</div>}
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default Login;
