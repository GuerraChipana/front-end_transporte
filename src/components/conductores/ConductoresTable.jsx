import { useState } from "react";
import { getUserRoleFromToken } from "../../utils/authHelper";
import { cambiarEstadoConductores } from "../../services/conductores";
import '../../styles/conductorTabla.css';

const ConductoresTable = ({ conductores, onEdit, onEstado }) => {
    const rol = getUserRoleFromToken();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 15;

    // Calcular los registros a mostrar según la página
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = conductores.slice(indexOfFirstRecord, indexOfLastRecord);

    // Función para manejar el cambio de estado
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
        } finally {
            setLoading(false);
        }
    };

    // Cambiar la página actual
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calcular el número total de páginas
    const totalPages = Math.ceil(conductores.length / recordsPerPage);

    return (
        <div className="conductor-tabla-container">
            {error && <div className="conductor-tabla-error-message">{error}</div>}
            <table className="conductor-tabla">
                <thead>
                    <tr>
                        <th className="conductor-tabla-header">ID</th>
                        <th className="conductor-tabla-header">DNI</th>
                        <th className="conductor-tabla-header">Nombre</th>
                        <th className="conductor-tabla-header">N°Licencia</th>
                        <th className="conductor-tabla-header">Fecha desde</th>
                        <th className="conductor-tabla-header">Fecha hasta</th>
                        <th className="conductor-tabla-header">Clase</th>
                        <th className="conductor-tabla-header">Categoría</th>
                        <th className="conductor-tabla-header">Restricción</th>
                        <th className="conductor-tabla-header">Sangre</th>
                        <th className="conductor-tabla-header">Vehículos</th>
                        {(rol === "superadministrador" || rol === "administrador") && <th className="conductor-tabla-header">Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((conductor) => (
                        <tr key={conductor.id}>
                            <td className="conductor-tabla-cell">{conductor.id}</td>
                            <td className="conductor-tabla-cell">
                                {conductor.id_persona.dni}
                                <div className="conductor-tabla-foto-container">
                                    <img src={conductor.id_persona.foto} width={45} alt="Foto de conductor" />
                                </div>
                            </td>
                            <td className="conductor-tabla-cell persona">{`${conductor.id_persona.nombre} ${conductor.id_persona.apellidos}`}</td>
                            <td className="conductor-tabla-cell">{conductor.n_licencia}</td>
                            <td className="conductor-tabla-cell">{conductor.fecha_desde}</td>
                            <td className="conductor-tabla-cell">{conductor.fecha_hasta}</td>
                            <td className="conductor-tabla-cell">{conductor.clase}</td>
                            <td className="conductor-tabla-cell">{conductor.categoria}</td>
                            <td className="conductor-tabla-cell restriccion">{conductor.restriccion || "Sin restricción"}                            </td>
                            <td className="conductor-tabla-cell">{conductor.g_sangre}</td>
                            <td className="conductor-tabla-cell vehiculos">
                                <ul className="conductor-tabla-vehiculo-list">
                                    {conductor.vehiculos.map((vehiculo, index) => (
                                        <li key={index}>{vehiculo.placa}</li>
                                    ))}
                                </ul>
                            </td>
                            {(rol === "superadministrador" || rol === "administrador") && (
                                <td className="conductor-tabla-actions">
                                    <button
                                        onClick={() => onEdit(conductor.id)}
                                        className="conductor-tabla-button-editar"
                                        disabled={loading}>
                                        {loading ? "Cargando..." : "Editar"}
                                    </button>
                                    <button
                                        onClick={() => ManejoCambioEstado(conductor.id, conductor.estado)}
                                        className={`conductor-tabla-button-cambiar-estado ${conductor.estado === 1 ? 'conductor-tabla-button-desactivar' : 'conductor-tabla-button-activar'}`}
                                        disabled={loading}>
                                        {loading ? "Cargando..." : conductor.estado === 1 ? 'Desactivar' : 'Activar'}
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Paginación */}
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        className={currentPage === index + 1 ? "active" : ""}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default ConductoresTable;
