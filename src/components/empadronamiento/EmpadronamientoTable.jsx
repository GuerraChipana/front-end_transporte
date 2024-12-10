import { useState } from "react";
import { cambiarEstadoEmpadronamiento } from "../../services/empadronamiento";
import { getUserRoleFromToken } from "../../utils/authHelper";
import '../../styles/empadronamientotabla.css'; // Asegúrate de importar el archivo CSS

const EmpadronamientoTabla = ({ empradronamientos, onEdit, onEstado }) => {
    const rol = getUserRoleFromToken();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 40;

    const totalPages = Math.ceil(empradronamientos.length / itemsPerPage);

    // Función para manejar el cambio de estado
    const ManejoCambioEstado = async (id, estado) => {
        const estadoCambio = estado === 1 ? 0 : 1;
        let detalleBaja = "";
        if (estadoCambio === 0) {
            detalleBaja = prompt("Motivo de baja (mínimo 15 caracteres)");
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

    // Función para obtener los registros de la página actual
    const currentItems = empradronamientos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
        <div className="empadronamiento-tabla-container">
            {error && <div className="error-message">{error}</div>} {/* Mostrar error si existe */}
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
                    {currentItems.map((empadronamiento) => (
                        <tr key={empadronamiento.id_empa}>
                            <td>{empadronamiento.id_empa}</td>
                            <td>{empadronamiento.n_empadronamiento}</td>
                            <td>{empadronamiento.id_vehiculo.placa}</td>
                            <td>
                                <img src={empadronamiento.id_vehiculo.imagen_url} alt="Vehiculo" />
                            </td>
                            <td>{empadronamiento.id_vehiculo.propietario1.dni} <br />{empadronamiento.id_vehiculo.propietario1.nombre}</td>
                            <td>{empadronamiento.id_vehiculo.propietario2.dni} <br />{empadronamiento.id_vehiculo.propietario2.nombre}</td>
                            {(rol === "superadministrador" || rol === "administrador") && (
                                <td>
                                    <button className="edit-button" onClick={() => onEdit(empadronamiento.id_empa)} disabled={loading}>
                                        {loading ? "Cargando..." : "Editar"}
                                    </button>
                                    <button className="toggle-button" onClick={() => ManejoCambioEstado(empadronamiento.id_empa, empadronamiento.estado)} disabled={loading}>
                                        {loading ? "Cargando..." : empadronamiento.estado === 1 ? 'Desactivar' : 'Activar'}
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Paginación */}
            <div className="empadronamiento-pagination">
                <button onClick={prevPage} className={currentPage === 1 ? "disabled" : ""} disabled={currentPage === 1}>Anterior</button>
                <span>{`Página ${currentPage} de ${totalPages}`}</span>
                <button onClick={nextPage} className={currentPage === totalPages ? "disabled" : ""} disabled={currentPage === totalPages}>Siguiente</button>
            </div>
        </div>
    );
};

export default EmpadronamientoTabla;
