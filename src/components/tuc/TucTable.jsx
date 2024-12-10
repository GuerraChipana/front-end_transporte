import { useState } from "react";
import { cambiarEstadoTuc } from "../../services/tuc";
import { getUserRoleFromToken } from "../../utils/authHelper";
import '../../styles/tuctabla.css';

const TucTabla = ({ tucs, onEdit, onEstado }) => {
    const rol = getUserRoleFromToken();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;

    // Manejar el cambio de estado
    const handleChangeState = async (id, estado) => {
        const estadoCambio = estado === 1 ? 0 : 1;
        let detalleBaja = "";
        if (estadoCambio === 0) {
            detalleBaja = prompt("Motivo de baja (minimo 15 letras)");
            if (!detalleBaja || detalleBaja.length < 15) {
                setError("Debe proporcionar un motivo valido para la baja");
                setTimeout(() => setError(null), 2500);
                return;
            }
        }
        setLoading(true);
        setError(null);

        try {
            await cambiarEstadoTuc(id, { estado: estadoCambio, detalle_baja: detalleBaja });
            onEstado();
        } catch (error) {
            alert("Error al cambiar el estado de la TUC");
        } finally {
            setLoading(false);
        }
    };

    // Calcular los registros para la página actual
    const indexOfLastTuc = currentPage * itemsPerPage;
    const indexOfFirstTuc = indexOfLastTuc - itemsPerPage;
    const currentTucs = tucs.slice(indexOfFirstTuc, indexOfLastTuc);

    // Cambiar la página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="tuc-tabla-container">
            <table className="tuc-tabla-table">
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

                <tbody className="td-tuc-container">
                    {currentTucs.map((tuc) => (
                        <tr key={tuc.id_tuc}>
                            <td>{tuc.id_tuc}</td>
                            <td>
                                {tuc.id_vehiculo.placa} <br />
                                <img src={tuc.id_vehiculo ? tuc.id_vehiculo.imagen_url : ""}  alt="Imagen del vehiculo" />
                            </td>
                            <td>{tuc.n_tuc}</td>
                            <td>{tuc.ano_tuc}</td>
                            <td>{tuc.fecha_desde}</td>
                            <td>{tuc.fecha_hasta}</td>
                            <td className={`tuc-tabla-estado ${tuc.estado_vigencia === "Vencido" ? "vencido" : "no-vencido"}`}>
                                {tuc.estado_vigencia}
                            </td>
                            <td>{tuc.id_asociacion.nombre}</td>
                            {(rol === "superadministrador" || rol === "administrador") && (
                                <td className="tuc-tabla-acciones">
                                    <button className="tuc-tabla-button tuc-tabla-button-editar" onClick={() => onEdit(tuc.id_tuc)}>
                                        Editar
                                    </button>
                                    <button className="tuc-tabla-button tuc-tabla-button-desactivar" onClick={() => handleChangeState(tuc.id_tuc, tuc.estado)}>
                                        {tuc.estado === 1 ? 'Desactivar' : 'Activar'}
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {error && <div className="tuc-tabla-error-message">{error}</div>}

            {/* Paginación */}
            <div className="tuc-tabla-pagination-container">
                <button
                    className="tuc-tabla-pagination-button"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <button
                    className="tuc-tabla-pagination-button"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage * itemsPerPage >= tucs.length}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default TucTabla;
