import { useState } from "react";
import { cambiarEstadoEmpadronamiento } from "../../services/empadronamiento";
import { getUserRoleFromToken } from "../../utils/authHelper";

const EmpadronamientoTabla = ({ empradronamientos, onEdit, onEstado }) => {
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
            await cambiarEstadoEmpadronamiento(id, { estado: estadoCambio, detalle_baja: detalleBaja });
            onEstado();
        } catch (error) {
            setError("Error al cambiar el estado del empadronamiento");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && <div className="error-message">{error}</div>}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>N° Empadronamiento</th>
                        <th>Placa</th>
                        <th>Vehiculo</th>
                        <th>Propietario 1</th>
                        <th>Propietario 2</th>
                        {(rol === "superadministrador" || rol === "administrador") && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {empradronamientos.map((empadronamiento) => (
                        <tr key={empadronamiento.id_empa}>
                            <td>{empadronamiento.id_empa}</td>
                            <td>{empadronamiento.n_empadronamiento}</td>
                            <td>{empadronamiento.id_vehiculo.placa}</td>
                            <td>
                                <img src={empadronamiento.id_vehiculo.imagen_url} width={60} alt="Vehiculo" />
                            </td>
                            <td>{empadronamiento.id_vehiculo.propietario1.dni} <br />{empadronamiento.id_vehiculo.propietario1.nombre}</td>

                            <td>{empadronamiento.id_vehiculo.propietario2.dni} <br />{empadronamiento.id_vehiculo.propietario2.nombre}</td>
                            {(rol === "superadministrador" || rol === "administrador") && (
                                <td>
                                    <button onClick={() => onEdit(empadronamiento.id_empa)} disabled={loading}>
                                        {loading ? "Cargando..." : "Editar"}
                                    </button>
                                    <button
                                        onClick={() => ManejoCambioEstado(empadronamiento.id_empa, empadronamiento.estado)}
                                        disabled={loading}>
                                        {loading ? "Cargando..." : empadronamiento.estado === 1 ? 'Desactivar' : 'Activar'}
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmpadronamientoTabla;
