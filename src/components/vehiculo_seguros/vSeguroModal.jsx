import React, { useState, useEffect } from "react";
import { listarAseguradoras } from "../../services/aseguradoras";
import { listarVehiculos } from "../../services/vehiculos";
import { registrarSeguroVehicular, actualizarSeguroVehicular, obtenerSeguroVehicularPorId } from "../../services/vehiculo_seguros";

const VehiculosSegurosModel = ({ tipoModal, seguroId, setModalIsOpen, onUpdate }) => {
    const [formData, setFormData] = useState({
        id_aseguradora: "",
        id_vehiculo: "",
        n_poliza: "",
        fecha_vigencia_desde: "",
        fecha_vigencia_hasta: "",
    });
    const [aseguradoras, setAseguradoras] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [filteredData, setFilteredData] = useState({ aseguradoras: [], vehiculos: [] });
    const [modalVisible, setModalVisible] = useState({ aseguradora: false, vehiculo: false });
    const [loading, setLoading] = useState(false);
    const [errores, setErrores] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [aseguradorasData, vehiculosData] = await Promise.all([listarAseguradoras(), listarVehiculos()]);
                setAseguradoras(aseguradorasData);
                setVehiculos(vehiculosData);
                setFilteredData({ aseguradoras: aseguradorasData, vehiculos: vehiculosData });

                if (tipoModal === "editar" && seguroId) {
                    const seguroData = await obtenerSeguroVehicularPorId(seguroId);
                    setFormData({
                        id_aseguradora: seguroData.id_aseguradora?.id || "",
                        id_vehiculo: seguroData.id_vehiculo?.id || "",
                        n_poliza: seguroData.n_poliza,
                        fecha_vigencia_desde: seguroData.fecha_vigencia_desde,
                        fecha_vigencia_hasta: seguroData.fecha_vigencia_hasta,
                    });
                }
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        loadData();
    }, [tipoModal, seguroId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchChange = (e, tipo) => {
        const searchValue = e.target.value.toLowerCase();
        setFilteredData(prev => ({
            ...prev,
            [tipo]: tipo === "aseguradoras"
                ? aseguradoras.filter(item => item.aseguradora.toLowerCase().includes(searchValue))
                : vehiculos.filter(item => item.placa.toLowerCase().includes(searchValue))
        }));
    };

    const openModal = (campo) => setModalVisible(prev => ({ ...prev, [campo]: true }));

    const selectOption = (id, tipo) => {
        const selected = tipo === "aseguradora" ? aseguradoras.find(item => item.id === id) : vehiculos.find(item => item.id === id);
        setFormData(prev => ({ ...prev, [`id_${tipo}`]: selected.id }));
        setModalVisible(prev => ({ ...prev, [tipo]: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (tipoModal === "crear") {
                await registrarSeguroVehicular(formData);
            } else if (tipoModal === "editar") {
                await actualizarSeguroVehicular(seguroId, formData);
            }
            setLoading(false);
            onUpdate();
            setModalIsOpen(false);
        } catch (error) {
            setLoading(false);
            if (error.response) {
                const backendErrors = error.response.data.errors || {};
                setErrores(backendErrors);
            } else {
                alert(error.message || 'Error al procesar la solicitud');
            }
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>{tipoModal === "crear" ? "Registrar Seguro Vehicular" : "Editar Seguro Vehicular"}</h3>
                {errores.length > 0 && <ul>{errores.map((error, index) => <li key={index}>{error}</li>)}</ul>}
                <form onSubmit={handleSubmit}>
                    <button type="button" onClick={() => openModal("aseguradora")}>
                        {formData.id_aseguradora ? `Aseguradora: ${aseguradoras.find(a => a.id === formData.id_aseguradora)?.aseguradora}` : "Seleccionar Aseguradora"}
                    </button>
                    <button type="button" onClick={() => openModal("vehiculo")}>
                        {formData.id_vehiculo ? `Vehículo: ${vehiculos.find(v => v.id === formData.id_vehiculo)?.placa}` : "Seleccionar Vehículo"}
                    </button>
                    <input type="text" name="n_poliza" value={formData.n_poliza} onChange={handleChange} placeholder="Número de Póliza" required />
                    <input type="date" name="fecha_vigencia_desde" value={formData.fecha_vigencia_desde} onChange={handleChange} required />
                    <input type="date" name="fecha_vigencia_hasta" value={formData.fecha_vigencia_hasta} onChange={handleChange} required />
                    <button type="submit" disabled={loading}>{loading ? "Cargando..." : tipoModal === "crear" ? "Registrar" : "Actualizar"}</button>
                </form>
                <button onClick={() => setModalIsOpen(false)}>Cerrar</button>
            </div>

            {modalVisible.aseguradora && (
                <div className="modal-buscar">
                    <input type="text" onChange={(e) => handleSearchChange(e, "aseguradoras")} placeholder="Buscar Aseguradora" />
                    <ul>
                        {filteredData.aseguradoras.map(aseguradora => (
                            <li key={aseguradora.id}>
                                <button onClick={() => selectOption(aseguradora.id, "aseguradora")}>{aseguradora.aseguradora}</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {modalVisible.vehiculo && (
                <div className="modal-buscar">
                    <input type="text" onChange={(e) => handleSearchChange(e, "vehiculos")} placeholder="Buscar Vehículo" />
                    <ul>
                        {filteredData.vehiculos.map(vehiculo => (
                            <li key={vehiculo.id}>
                                <button onClick={() => selectOption(vehiculo.id, "vehiculo")}>{vehiculo.placa}</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default VehiculosSegurosModel;
