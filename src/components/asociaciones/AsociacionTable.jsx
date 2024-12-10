import { useState } from "react";
import { cambiarEstadoAsociacion } from "../../services/asociaciones";
import { getUserRoleFromToken } from "../../utils/authHelper";
import '../../styles/asociacionestable.css'; // Asegúrate de importar el archivo CSS

const AsociacionTabla = ({ asociaciones, onEdit, onEstado }) => {
    const rol = getUserRoleFromToken();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Número de asociaciones por página

    // Calcular el total de páginas
    const totalPages = Math.ceil(asociaciones.length / itemsPerPage);

    // Función para manejar el cambio de estado
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
        } finally {
            setLoading(false);  // Desactivar estado de carga
        }
    };

    // Función para obtener los registros de la página actual
    const currentItems = asociaciones.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Funciones para cambiar de página
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="asociacion-tabla-container">
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
                    {currentItems.map((asociacion) => (
                        <tr key={asociacion.id}>
                            <td>{asociacion.id}</td>
                            <td>{asociacion.nombre}</td>
                            <td>{asociacion.documento}</td>
                            {(rol === "superadministrador" || rol === "administrador") && (
                                <td>
                                    <button
                                        className="edit-button"
                                        onClick={() => onEdit(asociacion.id)}
                                        disabled={loading}
                                    >
                                        {loading ? "Cargando..." : "Editar"}
                                    </button>
                                    <button
                                        className="toggle-button"
                                        onClick={() => ManejoCambioEstado(asociacion.id, asociacion.estado)}
                                        disabled={loading}
                                    >
                                        {loading ? "Cargando..." : asociacion.estado === 1 ? 'Desactivar' : 'Activar'}
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Paginación */}
            <div className="asociacion-pagination">
                <button onClick={prevPage} className={currentPage === 1 ? "disabled" : ""} disabled={currentPage === 1}>Anterior</button>
                <span>{`Página ${currentPage} de ${totalPages}`}</span>
                <button onClick={nextPage} className={currentPage === totalPages ? "disabled" : ""} disabled={currentPage === totalPages}>Siguiente</button>
            </div>
        </div>
    );
};

export default AsociacionTabla;
