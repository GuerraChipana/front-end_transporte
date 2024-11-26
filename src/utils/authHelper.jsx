export const isAuthenticated = () => {
  const token = sessionStorage.getItem('token');  // Verifica si el token JWT está en sessionStorage
  if (!token) {
    return false;  // Si no hay token, no está autenticado
  }

  // Si el token es un JWT, decodificamos el payload para verificar la expiración
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;  // Si el token no tiene la estructura esperada, no es válido
  }

  const decodedPayload = JSON.parse(atob(parts[1]));  // Decodificamos el payload
  const expirationDate = decodedPayload.exp * 1000;  // Convertimos la fecha de expiración a milisegundos

  // Si la fecha actual es mayor que la expiración, el token ha expirado
  if (Date.now() > expirationDate) {
    sessionStorage.removeItem('token');  // Limpiamos el token si ha expirado
    return false;  // El token ha expirado, no está autenticado
  }

  return true;  // El token es válido y no ha expirado
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
