//C:\Users\ferna\Transporte-Front\src\utils\authHelper.jsx
export const isAuthenticated = () => {
  return !!sessionStorage.getItem('token');  // Verifica si el token JWT está en sessionStorage
};

export const getUserRoleFromToken = () => {
  const token = sessionStorage.getItem('token');
  if (!token) { return null; }
  const parts = token.split('.');
  if (parts.length !== 3) { return null; }
  const decodedPayload = JSON.parse(atob(parts[1]));
  // Verificamos si el payload contiene el campo 'rol'
  return decodedPayload && decodedPayload.rol ? decodedPayload.rol : null;
};

