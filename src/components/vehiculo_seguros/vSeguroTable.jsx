import React, { useState } from "react";
import { cambiarEstadoSeguroVehicular } from "../../services/vehiculo_seguros";
import { getUserRoleFromToken } from "../../utils/authHelper";

const SeguroVehicularTabla = ({ seguros, onEdit, onChangeState }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Poliza</th>
          <th>Fecha Vigencia Desde</th>
          <th>Fecha Vigencia Hasta</th>
          <th>Estado de Vencimiento</th>
          <th>Aseguradora</th>
          <th>Vehículo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {seguros.map((seguro) => (
          <tr key={seguro.id_vehseg}>
            <td>{seguro.id_vehseg}</td>
                        <td>{seguro.n_poliza}</td>
            <td>{seguro.fecha_vigencia_desde}</td>
            <td>{seguro.fecha_vigencia_hasta}</td>
            <td>{seguro.estado_vencimiento}</td>
           <td>{seguro.id_aseguradora.aseguradora}</td>
            <td>
              {seguro.id_vehiculo.placa} <br />
              <img src={seguro.id_vehiculo.imagen_url} width={55} alt="Vehículo" />
            </td>

            <td>
              <button onClick={() => onEdit(seguro.id_vehseg)}>Editar</button>
              <button onClick={() => handleChangeState(seguro.id_vehseg, seguro.estado)}>
                {seguro.estado === 1 ? 'Desactivar' : 'Activar'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SeguroVehicularTabla;
