import { useState, useEffect } from "react";
import { registrarEmpadronamiento, actualizarEmpadronamiento, obtenerEmpadronamientoPorId } from "../../services/empadronamiento";
import { listarVehiculos } from "../../services/vehiculos";
import '../../styles/empadronamientoModal.css';

const EmpadronamientoModal = ({ tipoModal, empadronamientoId, setModalIsOpen, onUpdate }) => {
    const [formData, setFormData] = useState({ n_empadronamiento: '', id_vehiculo: '' });
    const [errors, setErrors] = useState({});
    const [vehiculos, setVehiculos] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const vehiculosData = await listarVehiculos();
                setVehiculos(vehiculosData);
                setFilteredData(vehiculosData);

                if (tipoModal === 'editar' && empadronamientoId) {
                    const empadronamientoData = await obtenerEmpadronamientoPorId(empadronamientoId);
                    setFormData({
                        n_empadronamiento: empadronamientoData.n_empadronamiento,
                        id_vehiculo: empadronamientoData.id_vehiculo?.id || "",
                    });
                }
            } catch {
                alert('Error al obtener los datos');
            }
        };
        loadData();
    }, [tipoModal, empadronamientoId]);

    const handleChange = ({ target: { name, value } }) => {
        setFormData(prev => ({
            ...prev,
            [name]: ['n_empadronamiento', 'id_vehiculo'].includes(name) ? Number(value) : value,
        }));
    };

    const handleSearchChange = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setFilteredData(vehiculos.filter(item => item.placa.toLowerCase().includes(searchValue)));
    };

    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    const selectOption = (id) => {
        setFormData(prev => ({ ...prev, id_vehiculo: id }));
        closeModal();
    };

    const validateForm = () => {
        const formErrors = {};
        if (!formData.n_empadronamiento) formErrors.n_empadronamiento = "El número de empadronamiento es obligatorio.";
        if (!formData.id_vehiculo) formErrors.id_vehiculo = "Debe seleccionar un vehículo.";
        setErrors(formErrors);
        return !Object.keys(formErrors).length;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const response = tipoModal === 'crear'
                ? await registrarEmpadronamiento(formData)
                : await actualizarEmpadronamiento(empadronamientoId, formData);
            onUpdate();
            setModalIsOpen(false);
        } catch (error) {
            setErrors(error.response?.data.errors || {});
            alert(error.message || 'Error al procesar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => setModalIsOpen(false);

    return (
        <div className="empadronamiento-modal-wrapper">
            <h3 className="empadronamiento-modal-header">{tipoModal === 'crear' ? "Registrar Empadronamiento" : "Editar Empadronamiento"}</h3>
            <form onSubmit={handleSubmit} className="empadronamiento-modal-form">
                <label className="empadronamiento-modal-label">N° Empadronamiento</label>
                <input
                    type="number"
                    name="n_empadronamiento"
                    value={formData.n_empadronamiento}
                    onChange={handleChange}
                    placeholder="Número de Empadronamiento"
                    className="empadronamiento-modal-input"
                    required
                />
                {errors.n_empadronamiento && <p className="empadronamiento-modal-error">{errors.n_empadronamiento}</p>}

                <button type="button" onClick={openModal} className="empadronamiento-modal-select-btn">
                    {formData.id_vehiculo ? `Vehiculo: ${vehiculos.find(v => v.id === formData.id_vehiculo)?.placa}` : "Seleccionar Vehículo"}
                </button>
                {errors.id_vehiculo && <p className="empadronamiento-modal-error">{errors.id_vehiculo}</p>}

                <div className="empadronamiento-modal-buttons">
                    <button type="submit" disabled={loading} className="empadronamiento-modal-submit-btn">
                        {loading ? "Guardando..." : tipoModal === 'crear' ? "Guardar" : "Actualizar"}
                    </button>
                    <button type="button" onClick={handleCancel} className="empadronamiento-modal-cancel-btn">Cancelar</button>
                </div>
            </form>

            {modalVisible && (
                <div className="empadronamiento-vehicular-modal-overlay">
                    <div className="empadronamiento-vehicular-modal-content">
                        <button type="button" onClick={closeModal} className="empadronamiento-vehicular-modal-close-btn">Cerrar</button>
                        <div className="empadronamiento-vehicular-modal-search-container">
                            <input
                                type="text"
                                onChange={handleSearchChange}
                                placeholder="Buscar Vehículo"
                                className="empadronamiento-vehicular-modal-search-input"
                            />
                            <ul className="empadronamiento-vehicular-modal-vehiculos-list">
                                {filteredData.map(vehiculo => (
                                    <li key={vehiculo.id} className="empadronamiento-vehicular-modal-vehiculo-item">
                                        <button onClick={() => selectOption(vehiculo.id)} className="empadronamiento-vehicular-modal-vehiculo-btn">
                                            {vehiculo.placa}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmpadronamientoModal;
