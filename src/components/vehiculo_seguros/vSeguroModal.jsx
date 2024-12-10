import React, { useState, useEffect } from "react";
import { listarAseguradoras } from "../../services/aseguradoras";
import { listarVehiculos } from "../../services/vehiculos";
import { registrarSeguroVehicular, actualizarSeguroVehicular, obtenerSeguroVehicularPorId } from "../../services/vehiculo_seguros";
import '../../styles/segurosModal.css';

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
                ? aseguradoras.filter(item => item.aseguradora.toLowerCase().includes(searchValue) && item.estado === 1)
                : vehiculos.filter(item => item.placa.toLowerCase().includes(searchValue) && item, estado === 1)
        }));
    };

    const openModal = (campo) => setModalVisible(prev => ({ ...prev, [campo]: true }));

    const closeModal = (campo) => setModalVisible(prev => ({ ...prev, [campo]: false }));

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
        <div className="seguro-vehicular-modal__wrapper">
            <div className="seguro-vehicular-modal__content">
                <h3>{tipoModal === "crear" ? "Registrar Seguro Vehicular" : "Editar Seguro Vehicular"}</h3>
                {errores.length > 0 && <ul className="seguro-vehicular-modal__error-list">{errores.map((error, index) => <li key={index}>{error}</li>)}</ul>}
                <form onSubmit={handleSubmit} className="seguro-vehicular-modal__form">
                    <button type="button" onClick={() => openModal("aseguradora")} className="seguro-vehicular-modal__select-btn">
                        {formData.id_aseguradora ? `Aseguradora: ${aseguradoras.find(a => a.id === formData.id_aseguradora)?.aseguradora}` : "Seleccionar Aseguradora"}
                    </button>
                    <button type="button" onClick={() => openModal("vehiculo")} className="seguro-vehicular-modal__select-btn">
                        {formData.id_vehiculo ? `Vehículo: ${vehiculos.find(v => v.id === formData.id_vehiculo)?.placa}` : "Seleccionar Vehículo"}
                    </button>
                    <label>N° Poliza:</label>
                    <input type="text" name="n_poliza" value={formData.n_poliza} onChange={handleChange} className="seguro-vehicular-modal__input" placeholder="Número de Póliza" required />
                    <label>Fecha de vigencia desde:</label><input type="date" name="fecha_vigencia_desde" value={formData.fecha_vigencia_desde} onChange={handleChange} className="seguro-vehicular-modal__input" required />
                    <label>Fecha de vigencia hasta:</label><input type="date" name="fecha_vigencia_hasta" value={formData.fecha_vigencia_hasta} onChange={handleChange} className="seguro-vehicular-modal__input" required />
                    <button type="submit" className="seguro-vehicular-modal__submit-btn" disabled={loading}>{loading ? "Cargando..." : tipoModal === "crear" ? "Registrar" : "Actualizar"}</button>
                </form>
                <button type="button" onClick={() => setModalIsOpen(false)} className="seguro-vehicular-modal__cancel-btn">Cerrar</button>
            </div>

            {/* Modal de aseguradora */}
            {modalVisible.aseguradora && (
                <div className="modal-visible-aseguradora">
                    <div className="modal-aseguradora-content">
                        {/* Botón de cerrar */}
                        <button className="modal-aseguradora-close-btn" onClick={() => closeModal("aseguradora")}>Cerrar</button>

                        {/* Input de búsqueda */}
                        <input
                            type="text"
                            onChange={(e) => handleSearchChange(e, "aseguradoras")}
                            className="modal-aseguradora-search-input"
                            placeholder="Buscar Aseguradora"
                        />

                        {/* Lista de aseguradoras filtradas */}
                        <ul className="modal-aseguradora-list">
                            {filteredData.aseguradoras.map(aseguradora => (
                                <li key={aseguradora.id} className="modal-aseguradora-item">
                                    <button className="modal-aseguradora-select-btn" onClick={() => selectOption(aseguradora.id, "aseguradora")}>
                                        {aseguradora.aseguradora}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Modal de vehículo */}
            {modalVisible.vehiculo && (
                <div className="modal-visible-vehiculo">
                    <div className="modal-vehiculo-content">
                        {/* Botón de cerrar */}
                        <button className="modal-vehiculo-close-btn" onClick={() => closeModal("vehiculo")}>Cerrar</button>

                        {/* Input de búsqueda */}
                        <input
                            type="text"
                            onChange={(e) => handleSearchChange(e, "vehiculos")}
                            className="modal-vehiculo-search-input"
                            placeholder="Buscar Vehículo"
                        />

                        {/* Lista de vehículos filtrados */}
                        <ul className="modal-vehiculo-list">
                            {filteredData.vehiculos.map(vehiculo => (
                                <li key={vehiculo.id} className="modal-vehiculo-item">
                                    <button className="modal-vehiculo-select-btn" onClick={() => selectOption(vehiculo.id, "vehiculo")}>
                                        {vehiculo.placa}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}


        </div>
    );
};

export default VehiculosSegurosModel;
