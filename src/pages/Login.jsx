import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Usamos useNavigate en lugar de useHistory
import { login } from '../services/auth';
import '../styles/loginPage.css';  // Importamos el archivo de estilos
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // Iconos de ojo
import { AiOutlineUser, AiOutlineLock } from 'react-icons/ai'; // Iconos de usuario y contraseña

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Controla la visibilidad de la contraseña
  const navigate = useNavigate();

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
    <div className="login-page">
      <div className="login-container">
        <h2>Inicio de Sesión</h2>
        <form onSubmit={handleSubmit}>
          {/* Campo de Usuario */}
          <div className="input-container">
            <AiOutlineUser className="icon" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario"
            />
          </div>

          {/* Campo de Contraseña */}
          <div className="input-container">
            <AiOutlineLock className="icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          {error && <div className="error">{error}</div>}
          <button type="submit">Acceder</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
