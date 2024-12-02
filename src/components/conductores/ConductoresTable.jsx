import { useState } from "react";
import { getUserRoleFromToken } from "../../utils/authHelper";
import { cambiarEstadoConductores } from "../../services/conductores";

const ConductoresTable = ({ conductores, onEdit, onEstado }) => {
    const rol = getUserRoleFromToken();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const ManejoCambioEstado = async (id, estado) => {
        const estadoCambio = estado === 1 ? 0 : 1;
        let detalleBaja = "";
        if (estadoCambio === 0) {
            detalleBaja = prompt("Motivo de baja(minimo 15 caracteres)");
            if (!detalleBaja || detalleBaja.length < 15) {
                setError("Debe proporcionar un motivo válido para la baja.");
                setTimeout(() => setError(null), 2500);
                return;
            }
        }
        setLoading(true);
        setError(null);
        try {
            await cambiarEstadoConductores(id, { estado: estadoCambio, detalle_baja: detalleBaja });
            onEstado();
        } catch (error) {
            setError("Error al cambiar el estado del conductor");
        } finally { setLoading(false) };


    };
    return (
        <div>
            {error && <div className="error-message">{error}</div>}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>DNI</th>
                        <th>Persona</th>
                        <th>N°Licencia</th>
                        <th>Fecha desde</th>
                        <th>Fecha hasta</th>
                        <th>Clase</th>
                        <th>categoria</th>
                        <th>Restriccion</th>
                        <th>Sangre</th>
                        <th>Vehiculos:</th>
                    </tr>
                </thead>
                <tbody>
                    {conductores.map((conductor) => (
                        <tr key={conductor.id}>
                            <td>{conductor.id}</td>
                            <td>{conductor.id_persona.dni}<img src={conductor.id_persona.foto} width={45} /></td>
                            <td>{`${conductor.id_persona.nombre} ${conductor.id_persona.apellidos}`}</td>
                            <td>{conductor.n_licencia}</td>
                            <td>{conductor.fecha_desde}</td>
                            <td>{conductor.fecha_hasta}</td>
                            <td>{conductor.clase}</td>
                            <td>{conductor.categoria}</td>
                            <td>{conductor.restriccion || "Sin restricción"}</td>
                            <td>{conductor.g_sangre}</td>
                            <td>
                                {conductor.vehiculos.map((vehiculo, index) => (
                                    <div key={index}>{vehiculo.placa}</div>
                                ))}
                            </td>
                            {(rol === "superadministrador" || rol === "administrador") && (
                                <td>
                                    <button onClick={() => onEdit(conductor.id)} disabled={loading}>
                                        {loading ? "Cargando..." : "Editar"}
                                    </button>
                                    <button
                                        onClick={() => ManejoCambioEstado(conductor.id, conductor.estado)}
                                        disabled={loading}>
                                        {loading ? "Cargando..." : conductor.estado === 1 ? 'Desactivar' : 'Activar'}
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    );
};
export default ConductoresTable