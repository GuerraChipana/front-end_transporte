import { useState } from "react";
import { cambiarEstadoAsociacion } from "../../services/asociaciones";
import { getUserRoleFromToken } from "../../utils/authHelper";

const AsociacionTabla = ({ asociaciones, onEdit, onEstado }) => {
    const rol = getUserRoleFromToken();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const ManejoCambioEstado = async (id, estado) => {
        const estadoCambio = estado === 1 ? 0 : 1;
        let detalle_baja = "";
        if (estadoCambio === 0) {
            detalle_baja = prompt("Motivo de baja (mínimo 15 caracteres)");
            if (!detalle_baja || detalle_baja.length < 15) {
                setError("Debe proporcionar un motivo válido para la baja.");
                setTimeout(() => setError(null), 2500);
                return;
            }
        }

        setLoading(true);
        setError(null);

        try {
            await cambiarEstadoAsociacion(id, { estado: estadoCambio, detalle_baja: detalle_baja });
            onEstado();  // Actualizar el estado de la lista después de la operación.
        } catch (error) {
            setError("Error al cambiar el estado de la asociación.");
            console.error("Error al cambiar estado:", error);  // Imprimir el error para depuración.
        } finally {
            setLoading(false);  // Desactivar estado de carga
        }
    };

    return (
        <div>
            {error && <div className="error-message">{error}</div>}  {/* Mostrar error si existe */}

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Documento</th>
                        {(rol === "superadministrador" || rol === "administrador") && (<th>Acciones</th>)}
                    </tr>
                </thead>
                <tbody>
                    {asociaciones.map((asociacion) => (
                        <tr key={asociacion.id}>
                            <td>{asociacion.id}</td>
                            <td>{asociacion.nombre}</td>
                            <td>{asociacion.documento}</td>
                            {(rol === "superadministrador" || rol === "administrador") && (
                                <td>
                                    <button onClick={() => onEdit(asociacion.id)} disabled={loading}>
                                        {loading ? "Cargando..." : "Editar"}
                                    </button>
                                    <button
                                        onClick={() => ManejoCambioEstado(asociacion.id, asociacion.estado)}
                                        disabled={loading}>
                                        {loading ? "Cargando..." : asociacion.estado === 1 ? 'Desactivar' : 'Activar'}
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

export default AsociacionTabla;
