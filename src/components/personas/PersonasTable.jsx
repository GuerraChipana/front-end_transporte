import { useState } from "react";
import { getUserRoleFromToken } from "../../utils/authHelper";
import { cambiarEstadoPersona } from "../../services/personas";
import '../../styles/personaTabla.css';

const PersonasTable = ({ personas, onEdit, OnEstado }) => {
    const rol = getUserRoleFromToken();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 15;

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = personas.slice(indexOfFirstRecord, indexOfLastRecord);

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
            await cambiarEstadoPersona(id, { estado: estadoCambio, detalle_baja: detalleBaja });
            OnEstado(); // Refresh estado after change
        } catch (error) {
            setError("Error al cambiar el estado de la persona");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(personas.length / recordsPerPage);

    return (
        <div className="persona-tabla-container">
            <table className="persona-tabla">
                <thead className="persona-tabla-titulos">
                    <tr>
                        <th>ID</th>
                        <th>Foto</th>
                        <th>DNI</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Domicilio</th>
                        {(rol === "superadministrador" || rol === "administrador") && <th>Email</th>}
                        <th>Telefono</th>
                        {(rol === "superadministrador" || rol === "administrador") && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((persona) => (
                        <tr key={persona.id}>
                            <td>{persona.id}</td>
                            <td>
                                <img
                                    src={persona.foto || 'sin foto'} // Usa una imagen por defecto si no hay foto
                                    className="persona-tabla-img"
                                    alt={persona.dni}
                                />
                            </td>
                            <td>{persona.dni}</td>
                            <td>{persona.nombre}</td>
                            <td>{`${persona.apPaterno} ${persona.apMaterno || ''}`}</td>
                            <td className="persona-tabla-cell-domicilio">
                                {persona.domicilio || 'Dirección no disponible'}
                            </td>
                            {(rol === "superadministrador" || rol === "administrador") && (
                                <td className="persona-tabla-cell-email">
                                    {persona.email || 'Sin correo'}
                                </td>
                            )}
                            <td>{persona.telefono}</td>
                            {(rol === "superadministrador" || rol === "administrador") && (
                                <td>
                                    <button className="persona-tabla-button-editar" onClick={() => onEdit(persona.id)}>Editar</button>
                                    <button
                                        className={`persona-tabla-button-cambiar-estado ${persona.estado === 1 ? 'persona-tabla-button-desactivar' : 'persona-tabla-button-activar'}`}
                                        onClick={() => ManejoCambioEstado(persona.id, persona.estado)}
                                    >
                                        {persona.estado === 1 ? "Desactivar" : "Activar"}
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>


            <div className="persona-pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Siguiente
                </button>
            </div>

            {/* Error message */}
            {error && <div className="persona-error-message">{error}</div>}
        </div>
    );
};

export default PersonasTable;
