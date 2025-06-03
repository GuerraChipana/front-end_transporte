import { useState } from "react";
import { cambiarEstadoVehiculo } from "../../services/vehiculos";
import _ from 'lodash';
import { getUserRoleFromToken } from "../../utils/authHelper";
import '../../styles/vehiculostabla.css';

const VehiculosTable = ({ vehiculos, onEdit, onChangeState }) => {
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [recordsPerPage] = useState(15); // Número de registros por página
    const rol = getUserRoleFromToken();

    const handleChangeState = async (id, estado) => {
        const estadoCambio = estado === 1 ? 0 : 1;
        const detalleBaja = estadoCambio === 0 ? prompt("Motivo de baja:") : "";

        // Validar que el motivo de baja no sea vacío
        if (estadoCambio === 0 && !detalleBaja) {
            alert("Debe proporcionar un motivo para la baja.");
            return;
        }

        try {
            await cambiarEstadoVehiculo(id, { estado: estadoCambio, detalle_baja: detalleBaja });
            onChangeState(); // Actualizar el estado de la tabla
        } catch (error) {
            alert("Error al cambiar el estado del vehículo.");
        }
    };

    // Calcular los registros a mostrar en la página actual
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = vehiculos.slice(indexOfFirstRecord, indexOfLastRecord);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calcular el número total de páginas
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(vehiculos.length / recordsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="vehiculos-table-container">
            <table className="vehiculos-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Placa</th>
                        <th>Imagen</th>
                        <th>Marca</th>
                        <th>Motor</th>
                        <th>N° Tarjeta</th>
                        <th>Color</th>
                        <th>Propietario 1</th>
                        <th>Propietario 2</th>
                        <th>Año de compra</th>
                        {(rol === "superadministrador" || rol === "administrador") && (<th>Acciones</th>)}
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((vehiculo) => (
                        <tr key={vehiculo.id}>
                            <td>{vehiculo.id}</td>
                            <td>{vehiculo.placa}</td>
                            <td><img src={vehiculo.imagen_url} alt="Imagen vehículo" /></td>
                            <td>{vehiculo.marca}</td>
                            <td>{vehiculo.n_motor}</td>
                            <td>{vehiculo.n_tarjeta}</td>
                            <td>{vehiculo.color}</td>
                            <td className="propietario-info">{`${vehiculo.propietario1.dni} ${_.startCase(vehiculo.propietario1.nombre.toLowerCase())}`}</td>
                            <td className="propietario-info">{vehiculo.propietario2 ? `${vehiculo.propietario2.dni} ${_.startCase(vehiculo.propietario2.nombre.toLowerCase())}` : "No asignado"}</td>
                            <td>{vehiculo.ano_de_compra}</td>
                            <td>
                                {(rol === "superadministrador" || rol === "administrador") && (
                                    <>
                                        <button className="button-editar" onClick={() => onEdit(vehiculo.id)}>Editar</button>
                                        <button
                                            className={`button-cambiar-estado ${vehiculo.estado === 1 ? 'button-desactivar' : 'button-activar'}`}
                                            onClick={() => handleChangeState(vehiculo.id, vehiculo.estado)}>
                                            {vehiculo.estado === 1 ? 'Desactivar' : 'Activar'}
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    Anterior
                </button>

                <span className="page-indicator">
                    Página {currentPage} de {Math.ceil(vehiculos.length / recordsPerPage)}
                </span>

                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(vehiculos.length / recordsPerPage)}
                    className="pagination-button"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default VehiculosTable;
