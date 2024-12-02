import { useState, useEffect } from "react";
import { registrarConductor, actualizarConductor, obtenerConductorPorId } from "../../services/conductores";
import { listarVehiculos } from "../../services/vehiculos";
import { listarPersonas } from "../../services/personas";

const ConductoresModal = ({ tipoModal, conductorId, setModalIsOpen, onUpdate }) => {
    const [formData, setFormData] = useState({
        id_persona: "",
        n_licencia: "",
        categoria: "",
        fecha_desde: "",
        g_sangre: "",
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

                // Si es un modal de edición, obtener los datos del conductor
                if (tipoModal === "editar" && conductorId) {
                    const conductoresData = await obtenerConductorPorId(conductorId);
                    setFormData({
                        id_persona: conductoresData.id_persona.id,
                        vehiculos: conductoresData.vehiculos.map(v => v.id),
                        g_sangre: conductoresData.g_sangre,
                        categoria: conductoresData.categoria,
                        fecha_desde: conductoresData.fecha_desde,
                        n_licencia: conductoresData.n_licencia,
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
        }
        closeModal(tipo);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = { ...formData };
        if (tipoModal === "editar") {
            delete formDataToSend.id_persona; // Eliminar el campo 'id_persona' 
        }

        // Asegurarse de que los vehículos sean números (no cadenas)
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
        <div>
            <div>
                <h3>{tipoModal === "crear" ? "Registrar Conductor" : "Editar Conductor"}</h3>
                {errores.length > 0 && <ul>{errores.map((error, index) => <li key={index}>{error}</li>)}</ul>}
                <form onSubmit={handleSubmit}>
                    {/* Solo se muestra en 'crear', no en 'editar' */}
                    {tipoModal === "crear" && (
                        <div>
                            <button type="button" onClick={() => openModal("persona")}>
                                {formData.id_persona ? `Persona: ${personas.find(v => v.id === formData.id_persona)?.dni}` : "Seleccionar Persona"}
                            </button>
                        </div>
                    )}
                    <div>
                        <label>N° Licencia:</label>
                        <input type="text" name="n_licencia" value={formData.n_licencia} onChange={handleChange} placeholder="Numero de Licencia" required />
                    </div>
                    <div>
                        <label>Categoria:</label>
                        <input type="text" name="categoria" value={formData.categoria} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Fecha desde:</label>
                        <input type="date" name="fecha_desde" value={formData.fecha_desde} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Grupo Sanguineo:</label>
                        <input type="text" name="g_sangre" value={formData.g_sangre} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Vehiculos a conducir:</label>
                        <select
                            multiple
                            name="vehiculos"
                            value={formData.vehiculos}
                            onChange={handleChange}
                        >
                            {vehiculos.map((vehiculo) => (
                                <option key={vehiculo.id} value={vehiculo.id}>
                                    {vehiculo.placa}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" disabled={loading}>{loading ? "Cargando..." : tipoModal === "crear" ? "Registrar" : "Actualizar"}</button>
                </form>

                {/* Modal de Selección de Persona */}
                {modalVisible.persona && (
                    <div className="modal-buscar">
                        <input type="text" onChange={(e) => handleSearchChange(e, "personas")} placeholder="Buscar Persona por DNI" />
                        <ul>
                            {filteredData.personas.map(persona => (
                                <li key={persona.id}>
                                    <button onClick={() => selectOption(persona.id, "persona")}>
                                        {persona.dni} - {persona.nombre}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Modal de Selección de Vehículo */}
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
        </div>
    );
};

export default ConductoresModal;
