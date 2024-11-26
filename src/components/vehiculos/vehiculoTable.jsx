import React from "react";
import { cambiarEstadoVehiculo } from "../../services/vehiculos";
import _ from 'lodash';
import { getUserRoleFromToken } from "../../utils/authHelper";

const VehiculosTable = ({ vehiculos, onEdit, onChangeState }) => {
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

    return (
        <table>
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
                    <th>Estado</th>
                    {(rol === "superadministrador" || rol === "administrador") && (<th>Acciones</th>)}
                </tr>
            </thead>
            <tbody>
                {vehiculos.map((vehiculo) => (
                    <tr key={vehiculo.id}>
                        <td>{vehiculo.id}</td>
                        <td>{vehiculo.placa}</td>
                        <td><img src={vehiculo.imagen_url} alt="Imagen vehículo" width={40} /></td>
                        <td>{vehiculo.marca}</td>
                        <td>{vehiculo.n_motor}</td>
                        <td>{vehiculo.n_tarjeta}</td>
                        <td>{vehiculo.color}</td>
                        <td>{`${vehiculo.propietario1.dni} ${_.startCase(vehiculo.propietario1.nombre.toLowerCase())}`}</td>
                        <td>{vehiculo.propietario2 ? `${vehiculo.propietario2.dni} ${_.startCase(vehiculo.propietario2.nombre.toLowerCase())}` : "No asignado"}</td>
                        <td>{vehiculo.ano_de_compra}</td>
                        <td>{vehiculo.estado === 1 ? "Activo" : "Inactivo"}</td>
                        <td>
                            {(rol === "superadministrador" || rol === "administrador") && (
                                <>
                                    <button onClick={() => onEdit(vehiculo.id)}>Editar</button>
                                    <button onClick={() => handleChangeState(vehiculo.id, vehiculo.estado)}>
                                        Cambiar Estado
                                    </button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default VehiculosTable;
