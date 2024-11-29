import { useState } from "react";
import { cambiarEstadoTuc } from "../../services/tuc";
import { getUserRoleFromToken } from "../../utils/authHelper";

const TucTabla = ({ tucs, onEdit, onEstado }) => {
    const rol = getUserRoleFromToken();
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    //Manejar el cambio de estado
    const handleChangeState = async (id, estado) => {
        const estadoCambio = estado === 1 ? 0 : 1;
        let detalleBaja = "";
        if (estadoCambio === 0) {
            detalleBaja = prompt("Motivo de baja (minimo 15 letras)");
            if (!detalleBaja || detalleBaja.length < 15) {
                setError("Debe proporcionar un motivo valido para la baja");
                setTimeout(() => setError(null), 2500);
                return;
            };
        };
        setLoading(true);
        setError(null);

        try {
            await cambiarEstadoTuc(id, { estado: estadoCambio, detalle_baja: detalleBaja });
            onEstado();
        } catch (error) {
            alert("Error al cambiar el estado de la TUC");
        } finally { setLoading(false) };
    };

    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Vehículo</th>
                    <th>N° TUC</th>
                    <th>Año TUC</th>
                    <th>Fecha desde</th>
                    <th>Fecha hasta</th>
                    <th>Estado de vigencia</th>
                    <th>Asociación</th>
                    {(rol === "superadministrador" || rol === "administrador") && <th>Acciones</th>}
                </tr>
            </thead>

            <tbody>
                {tucs.map((tuc) => (
                    <tr key={tuc.id_tuc}>
                        <td>{tuc.id_tuc}</td>
                        <td>
                            {tuc.id_vehiculo.placa} <br />
                            <img src={tuc.id_vehiculo ? tuc.id_vehiculo.imagen_url : ""} width={40} alt="Imagen del vehiculo" />
                        </td>
                        <td>{tuc.n_tuc}</td>
                        <td>{tuc.ano_tuc}</td>
                        <td>{tuc.fecha_desde}</td>
                        <td>{tuc.fecha_hasta}</td>
                        <td>{tuc.estado_vigencia}</td>
                        <td>{tuc.id_asociacion.nombre}</td>
                        {(rol === "superadministrador" || rol === "administrador") && (
                            <td>
                                <button onClick={() => onEdit(tuc.id_tuc)}>Editar</button>
                                <button onClick={() => handleChangeState(tuc.id_tuc, tuc.estado)}>
                                    {tuc.estado === 1 ? 'Desactivar' : 'Activar'}
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>

        </table>
    );
};
export default TucTabla;


