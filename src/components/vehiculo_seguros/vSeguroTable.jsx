import React, { useState } from "react";
import { cambiarEstadoSeguroVehicular } from "../../services/vehiculo_seguros";
import { getUserRoleFromToken } from "../../utils/authHelper";
import '../../styles/segurostabla.css';

const SeguroVehicularTabla = ({ seguros, onEdit, onChangeState }) => {
  const rol = getUserRoleFromToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 40;
  const totalRecords = seguros.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  // Calcular los registros que se mostrarán en la página actual
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = seguros.slice(indexOfFirstRecord, indexOfLastRecord);

  // Cambiar la página actual
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle state change of insurance
  const handleChangeState = async (id, estado) => {
    const estadoCambio = estado === 1 ? 0 : 1;
    let detalle_baja = "";
    if (estadoCambio === 0) {
      detalle_baja = prompt("Motivo de baja (mínimo 15 letras)");

      if (!detalle_baja || detalle_baja.length < 15) {
        setError("Debe proporcionar un motivo válido para la baja.");
        setTimeout(() => setError(null), 2500);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      await cambiarEstadoSeguroVehicular(id, { estado: estadoCambio, detalle_baja: detalle_baja });
      onChangeState();
    } catch (error) {
      alert("Error al cambiar el estado del seguro vehicular.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="segurotabla-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Poliza</th>
            <th>Vehículo</th>
            <th>Fecha Vigencia Desde</th>
            <th>Fecha Vigencia Hasta</th>
            <th>Estado de Vencimiento</th>
            <th>Aseguradora</th>
            {(rol === "superadministrador" || rol === "administrador") && (<th>Acciones</th>)}
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((seguro) => (
            <tr key={seguro.id_vehseg}>
              <td>{seguro.id_vehseg}</td>
              <td>{seguro.n_poliza}</td>
              <td>
                {seguro.id_vehiculo.placa} <br />
                <img src={seguro.id_vehiculo.imagen_url} alt="Vehículo" className="segurotabla-img-vehiculo" />
              </td>
              <td>{seguro.fecha_vigencia_desde}</td>
              <td>{seguro.fecha_vigencia_hasta}</td>
              <td>{seguro.estado_vencimiento}</td>
              <td>{seguro.id_aseguradora.aseguradora}</td>

              {(rol === "superadministrador" || rol === "administrador") && (
                <td>
                  <button className="segurotabla-btn segurotabla-btn-editar" onClick={() => onEdit(seguro.id_vehseg)}>Editar</button>
                  <button
                    className="segurotabla-btn segurotabla-btn-cambiar-estado"
                    onClick={() => handleChangeState(seguro.id_vehseg, seguro.estado)}
                  >
                    {seguro.estado === 1 ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {error && <div className="segurotabla-error">{error}</div>}

      <div className="segurotabla-paginacion">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>

        <span>{currentPage} de {totalPages}</span>

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default SeguroVehicularTabla;
