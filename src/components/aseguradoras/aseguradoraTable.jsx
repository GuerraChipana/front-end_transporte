import React, { useState } from "react";
import { cambiarEstadoAseguradora } from '../../services/aseguradoras';
import { getUserRoleFromToken } from "../../utils/authHelper";
import '../../styles/Aseguradora.css';

const AseguradoraTabla = ({ aseguradoras, onEdit, onChangeState }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const rol = getUserRoleFromToken();

  const handleChangeState = async (id, estado) => {
    const estadoCambio = estado === 1 ? 0 : 1;
    let detalleBaja = "";

    if (estadoCambio === 0) {
      detalleBaja = prompt("Motivo de baja (mínimo 15 caracteres):");

      if (!detalleBaja || detalleBaja.length < 15) {
        setError("Debe proporcionar un motivo válido para la baja (mínimo 15 caracteres).");
        setTimeout(() => setError(null), 5000);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      await cambiarEstadoAseguradora(id, { estado: estadoCambio, detalle_baja: detalleBaja });
      onChangeState();
    } catch (error) {
      alert("Error al cambiar el estado de la Aseguradora.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p className="aseguradora-error-message">{error}</p>}

      <table className="aseguradora-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Aseguradora</th>
            <th>Estado</th>
            {(rol === "superadministrador" || rol === "administrador") && (<th>Acciones</th>)}
          </tr>
        </thead>
        <tbody>
          {aseguradoras?.map((aseguradora) => (
            <tr key={aseguradora.id}>
              <td>{aseguradora.id}</td>
              <td>{aseguradora.aseguradora}</td>
              <td>{aseguradora.estado === 1 ? "Activo" : "Inactivo"}</td>
              <td>
                {(rol === "superadministrador" || rol === "administrador") && (
                  <>
                    <button className="aseguradora-button aseguradora-button-edit" onClick={() => onEdit(aseguradora.id)}>Editar</button>
                    <button
                      className="aseguradora-button aseguradora-button-state"
                      onClick={() => handleChangeState(aseguradora.id, aseguradora.estado)}
                      disabled={loading}
                    >
                      {aseguradora.estado === 1 ? 'Desactivar' : 'Activar'}
                    </button>
                    {loading && <span>Procesando...</span>}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AseguradoraTabla;
