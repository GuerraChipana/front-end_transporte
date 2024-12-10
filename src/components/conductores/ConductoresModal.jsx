import { useState, useEffect } from "react";
import { registrarConductor, actualizarConductor, obtenerConductorPorId } from "../../services/conductores";
import { listarVehiculos } from "../../services/vehiculos";
import { listarPersonas } from "../../services/personas";
import '../../styles/conductorModal.css';

const ConductoresModal = ({ tipoModal, conductorId, setModalIsOpen, onUpdate }) => {
    const [formData, setFormData] = useState({
        id_persona: "",
        n_licencia: "",
        categoria: "",
        fecha_desde: "",
        g_sangre: "",
        restriccion: "",
        vehiculos: [],
    });

    const [vehiculos, setVehiculos] = useState([]);
    const [personas, setPersonas] = useState([]);
    const [filteredData, setFilteredData] = useState({ vehiculos: [], personas: [] });
    const [modalVisible, setModalVisible] = useState({ vehiculo: false, persona: false });
    const [loading, setLoading] = useState(false);
    const [errores, setErrores] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [vehiculosData, personasData] = await Promise.all([listarVehiculos(), listarPersonas()]);
                setVehiculos(vehiculosData);
                setPersonas(personasData);
                setFilteredData({ vehiculos: vehiculosData, personas: personasData });

                if (tipoModal === "editar" && conductorId) {
                    const conductoresData = await obtenerConductorPorId(conductorId);
                    setFormData({
                        id_persona: conductoresData.id_persona.id,
                        vehiculos: conductoresData.vehiculos.map(v => v.id),
                        g_sangre: conductoresData.g_sangre,
                        categoria: conductoresData.categoria,
                        fecha_desde: conductoresData.fecha_desde,
                        n_licencia: conductoresData.n_licencia,
                        restriccion: conductoresData.restriccion || "",
                    });
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    alert("Error loading data:", error);
                }
            }
        };
        loadData();
    }, [tipoModal, conductorId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "vehiculos" ? Array.from(e.target.selectedOptions, option => option.value) : value
        }));
    };

    const handleSearchChange = (e, tipo) => {
        const searchValue = e.target.value.toLowerCase();
        setFilteredData(prev => ({
            ...prev,
            [tipo]: tipo === "vehiculos"
                ? vehiculos.filter(item => item.placa.toLowerCase().includes(searchValue))
                : personas.filter(item => item.dni.toLowerCase().includes(searchValue))
        }));
    };

    const openModal = (campo) => setModalVisible(prev => ({ ...prev, [campo]: true }));

    const closeModal = (campo) => setModalVisible(prev => ({ ...prev, [campo]: false }));

    const selectOption = (id, tipo) => {
        const selected = tipo === "persona" ? personas.find(item => item.id === id) : vehiculos.find(item => item.id === id);
        if (tipo === "persona") {
            setFormData(prev => ({ ...prev, id_persona: selected.id }));
        } else if (tipo === "vehiculo") {
            const vehiculosSeleccionados = formData.vehiculos.includes(selected.id)
                ? formData.vehiculos.filter(vehiculoId => vehiculoId !== selected.id)
                : [...formData.vehiculos, selected.id];

            setFormData(prev => ({ ...prev, vehiculos: vehiculosSeleccionados }));
        }
        closeModal(tipo);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = { ...formData };
        if (tipoModal === "editar") {
            delete formDataToSend.id_persona; // Eliminar el campo 'id_persona' 
        }

        formDataToSend.vehiculos = formDataToSend.vehiculos.map(vehiculo => Number(vehiculo));

        try {
            setLoading(true);
            if (tipoModal === "crear") {
                await registrarConductor(formDataToSend);
            } else if (tipoModal === "editar") {
                await actualizarConductor(conductorId, formDataToSend);
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
                alert(error.message || "Error al procesar la solicitud");
            }
        }
    };

    return (
        <div className="modal-conductor-container">
            <div className="modal-conductor-wrapper">
                <h3 className="conductor-modal-title-label">{tipoModal === "crear" ? "Registrar Conductor" : "Editar Conductor"}</h3>
                {errores.length > 0 && <ul className="error-list">{errores.map((error, index) => <li key={index}>{error}</li>)}</ul>}
                <form className="modal-conductor-form" onSubmit={handleSubmit}>
                    {tipoModal === "crear" && (
                        <div className="modal-conductor-select-button">
                            <button type="button" onClick={() => openModal("persona")}>
                                {formData.id_persona ? `Persona: ${personas.find(v => v.id === formData.id_persona)?.dni}` : "Seleccionar Persona"}
                            </button>
                        </div>
                    )}

                    <div className="modal-conductor-input-group">
                        <label htmlFor="n_licencia">N° Licencia:</label>
                        <input type="text" name="n_licencia" value={formData.n_licencia} onChange={handleChange} placeholder="Número de Licencia" required />
                    </div>

                    <div className="modal-conductor-input-group">
                        <label htmlFor="categoria">Categoría:</label>
                        <input type="text" name="categoria" value={formData.categoria} onChange={handleChange} required />
                    </div>

                    <div className="modal-conductor-input-group">
                        <label htmlFor="fecha_desde">Fecha desde:</label>
                        <input type="date" name="fecha_desde" value={formData.fecha_desde} onChange={handleChange} required />
                    </div>

                    <div className="modal-conductor-input-group">
                        <label htmlFor="g_sangre">Grupo Sanguíneo:</label>
                        <input type="text" name="g_sangre" value={formData.g_sangre} onChange={handleChange} required />
                    </div>

                    <div className="modal-conductor-input-group">
                        <label htmlFor="restriccion">Restricción:</label>
                        <input type="text" name="restriccion" value={formData.restriccion} onChange={handleChange} placeholder="Restricción (opcional)" />
                    </div>

                    <div className="modal-conductor-select-button">
                        <button type="button" onClick={() => openModal("vehiculo")}>
                            {formData.vehiculos.length > 0 ? `Vehículos seleccionados` : "Seleccionar Vehículos"}
                        </button>
                    </div>

                    <div className="modal-conductor-vehiculos">
                        <label>Vehículos:</label>
                        <div className="modal-conductor-vehiculos-seleccionados">
                            {formData.vehiculos.map((vehiculoId) => {
                                const vehiculo = vehiculos.find(v => v.id === vehiculoId);
                                return (
                                    <span key={vehiculoId} className="modal-conductor-vehiculo-etiqueta">
                                        {vehiculo?.placa}
                                        <button type="button" onClick={() => selectOption(vehiculoId, "vehiculo")} className="vehiculo-remove-button">❌</button>
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    <div className="conductor-button-container">
                        <button className="modal-conductor-close-button" onClick={() => setModalIsOpen(false)}>Cancelar</button>
                        <button type="submit" disabled={loading} className="modal-conductor-submit-button">
                            {loading ? "Cargando..." : tipoModal === "crear" ? "Registrar" : "Actualizar"}
                        </button>
                    </div>
                </form>


                {/* Modal de Selección de Persona */}
                {modalVisible.persona && (
                    <div className="modal-conductor-buscar">
                        <input
                            className="modal-conductor-buscar-input"
                            type="text"
                            onChange={(e) => handleSearchChange(e, "personas")}
                            placeholder="Buscar Persona por DNI"
                        />
                        <ul className="modal-conductor-buscar-lista">
                            {filteredData.personas.map(persona => (
                                <li key={persona.id}>
                                    <button onClick={() => selectOption(persona.id, "persona")}>
                                        {persona.dni} - {persona.nombre}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button className="close" onClick={() => closeModal("persona")}>
                            Cerrar
                        </button>
                    </div>
                )}

                {/* Modal de Selección de Vehículo */}
                {modalVisible.vehiculo && (
                    <div className="modal-conductor-buscar">
                        <input
                            className="modal-conductor-buscar-input"
                            type="text"
                            onChange={(e) => handleSearchChange(e, "vehiculos")}
                            placeholder="Buscar Vehículo"
                        />
                        <ul className="modal-conductor-buscar-lista">
                            {filteredData.vehiculos.map(vehiculo => (
                                <li key={vehiculo.id}>
                                    <button onClick={() => selectOption(vehiculo.id, "vehiculo")}>
                                        {vehiculo.placa}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button className="close" onClick={() => closeModal("vehiculo")}>
                            Cerrar
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ConductoresModal;
