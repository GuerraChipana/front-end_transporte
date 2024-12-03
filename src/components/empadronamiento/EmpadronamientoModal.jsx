import { useState, useEffect } from "react";
import { registrarEmpadronamiento, actualizarEmpadronamiento, obtenerEmpadronamientoPorId } from "../../services/empadronamiento";
import { listarVehiculos } from "../../services/vehiculos";
import '../../styles/empadronamientoModal.css';

const EmpadronamientoModal = ({ tipoModal, empadronamientoId, setModalIsOpen, onUpdate }) => {
    const [formData, setFormData] = useState({
        n_empadronamiento: '',
        id_vehiculo: '',
    });
    const [errors, setErrors] = useState({
        n_empadronamiento: '',
        id_vehiculo: '',
    });
    const [vehiculos, setVehiculos] = useState([]);
    const [filteredData, setFilteredData] = useState({ vehiculos: [] });
    const [modalVisible, setModalVisible] = useState(false); // Control de visibilidad del modal para vehículos
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const vehiculosData = await listarVehiculos(); // Asegúrate de que esta función devuelva una lista válida de vehículos
                setVehiculos(vehiculosData);
                setFilteredData({ vehiculos: vehiculosData });

                if (tipoModal === 'editar' && empadronamientoId) {
                    const empadronamientoData = await obtenerEmpadronamientoPorId(empadronamientoId);
                    setFormData({
                        n_empadronamiento: Number(empadronamientoData.n_empadronamiento),
                        id_vehiculo: empadronamientoData.id_vehiculo?.id || "",
                    });
                }

            } catch (error) {
                alert('Error al obtener los datos');
            }
        };
        loadData();
    }, [tipoModal, empadronamientoId]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Convertir a número solo para los campos n_empadronamiento e id_vehiculo
        setFormData(prev => ({
            ...prev,
            [name]: name === 'n_empadronamiento' || name === 'id_vehiculo' ? Number(value) : value
        }));
    };

    const handleSearchChange = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setFilteredData(prev => ({
            ...prev,
            vehiculos: vehiculos.filter(item => item.placa.toLowerCase().includes(searchValue)),
        }));
    };

    const openModal = () => {
        setModalVisible(true);  // Esto abre el modal de selección de vehículo
    };

    const closeModal = () => {
        setModalVisible(false); // Cierra el modal
    };

    const selectOption = (id) => {
        const selected = vehiculos.find(item => item.id === id);
        setFormData(prev => ({ ...prev, id_vehiculo: selected.id }));
        closeModal(); // Cierra el modal después de seleccionar el vehículo
    };

    const validateForm = () => {
        let formErrors = {};
        if (!formData.n_empadronamiento) {
            formErrors.n_empadronamiento = "El número de empadronamiento es obligatorio.";
        }
        if (!formData.id_vehiculo) {
            formErrors.id_vehiculo = "Debe seleccionar un vehículo.";
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            let response;
            if (tipoModal === 'crear') {
                response = await registrarEmpadronamiento(formData);
            } else if (tipoModal === 'editar') {
                response = await actualizarEmpadronamiento(empadronamientoId, formData);
            }
            onUpdate();
            setModalIsOpen(false);
        } catch (error) {
            if (error.response) {
                const backendErrors = error.response.data.errors || {};
                setErrors(backendErrors);
            } else {
                alert(error.message || 'Error al procesar la solicitud');
            }
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar el cierre del modal al hacer clic en "Cancelar"
    const handleCancel = () => {
        setModalIsOpen(false);  // Cierra el modal
    };

    return (
        <div className="empadronamiento-modal__wrapper">
            <h3 className="empadronamiento-modal__header">{tipoModal === 'crear' ? "Registrar Empadronamiento" : "Editar Empadronamiento"}</h3>
            <form onSubmit={handleSubmit} className="empadronamiento-modal__form">
                <label className="empadronamiento-modal__label">N° Empadronamiento</label>
                <input
                    type="text"
                    name="n_empadronamiento"
                    value={formData.n_empadronamiento}
                    onChange={handleChange}
                    placeholder="Número de Empadronamiento"
                    required
                    className="empadronamiento-modal__input"
                />
                {errors.n_empadronamiento && <p className="empadronamiento-modal__error">{errors.n_empadronamiento}</p>}

                <button type="button" onClick={openModal} className="empadronamiento-modal__select-btn">
                    {formData.id_vehiculo ? `Vehiculo: ${vehiculos.find(a => a.id === formData.id_vehiculo)?.placa}` : "Seleccionar Vehículo"}
                </button>
                {errors.id_vehiculo && <p className="empadronamiento-modal__error">{errors.id_vehiculo}</p>}

                <div className="empadronamiento-modal__buttons">
                    <button type="submit" disabled={loading} className="empadronamiento-modal__submit-btn">
                        {loading ? "Guardando..." : tipoModal === 'crear' ? "Guardar" : "Actualizar"}
                    </button>
                    <button type="button" onClick={handleCancel} className="empadronamiento-modal__cancel-btn">
                        Cancelar
                    </button>
                </div>
            </form>

            {/* Modal de búsqueda de vehículos */}
            {modalVisible && (
                <div className="vehiculo-search-modal">
                    <div className="vehiculo-search-modal__content">
                        <div className="empadronamiento-modal__content">
                            <input
                                type="text"
                                onChange={handleSearchChange}
                                placeholder="Buscar Vehículo"
                                className="vehiculo-search-modal__search-input"
                            />
                            <ul className="vehiculo-search-modal__vehiculos-list">
                                {filteredData.vehiculos.map(vehiculo => (
                                    <li key={vehiculo.id} className="vehiculo-search-modal__vehiculo-item">
                                        <button onClick={() => selectOption(vehiculo.id)} className="vehiculo-search-modal__vehiculo-btn">
                                            {vehiculo.placa}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button type="button" onClick={closeModal} className="vehiculo-search-modal__close-btn">X</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmpadronamientoModal;
