import React, { useState, useEffect } from "react";
import { listarPersonas } from "../../services/personas";
import { registrarVehiculo, actualizarVehiculo, obtenerVehiculoPorId } from "../../services/vehiculos";
import '../../styles/vehiculosModal.css';

const VehiculoModal = ({ tipo, vehiculoId, isOpen, onClose, onVehiculoUpdated }) => {
    const [vehiculo, setVehiculo] = useState({
        imagen_url: "",
        placa: "",
        n_tarjeta: "",
        n_motor: "",
        marca: "",
        color: "",
        ano_de_compra: "",
        propietario1: "",
        propietario2: "" || null,
    });
    const [personas, setPersonas] = useState([]);
    const [personasFiltradas, setPersonasFiltradas] = useState([]);
    const [errores, setErrores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [campoPropietario, setCampoPropietario] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (tipo === "crear") {
                setVehiculo({
                    imagen_url: "",
                    placa: "",
                    n_tarjeta: "",
                    n_motor: "",
                    marca: "",
                    color: "",
                    ano_de_compra: "",
                    propietario1: "",
                    propietario2: "",
                });
                setFile(null);
                setErrores([]);
            }

            const cargarPersonas = async () => {
                try {
                    const personasData = await listarPersonas();
                    setPersonas(personasData);
                    setPersonasFiltradas(personasData);
                } catch (error) {
                    console.error(error); // Manejo de error
                }
            };

            cargarPersonas();

            if (tipo === "editar" && vehiculoId) {
                const cargarVehiculo = async () => {
                    try {
                        const vehiculoData = await obtenerVehiculoPorId(vehiculoId);
                        const { propietario1, propietario2 } = vehiculoData;
                        setVehiculo({
                            ...vehiculoData,
                            propietario1: propietario1?.id || "",
                            propietario2: propietario2?.id || "",
                        });
                    } catch (error) {
                        console.error(error); // Manejo de error
                    }
                };
                cargarVehiculo();
            }
        }
    }, [isOpen, tipo, vehiculoId]);

    const handleInputChange = (e) => setVehiculo({ ...vehiculo, [e.target.name]: e.target.value });
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!allowedTypes.includes(file.type)) {
                alert('Solo se permiten archivos de imagen (.jpg, .jpeg, .png, .gif)');
                setFile(null); // Limpiar el archivo si no es válido
            } else {
                setFile(file);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validación de tipo de archivo antes de enviar el formulario
        if (file) {
            const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!allowedTypes.includes(file.type)) {
                alert('Solo se permiten archivos de imagen (.jpg, .jpeg, .png, .gif)');
                return; // No continuar con el envío si el tipo de archivo es incorrecto
            }
        }
    
        // Validación: propietario1 no puede ser igual a propietario2
        if (vehiculo.propietario1 === vehiculo.propietario2) {
            alert("El propietario 1 no puede ser igual al propietario 2.");
            return;
        }
    
        setLoading(true);
        const formData = new FormData();
    
        // Si hay un archivo de imagen, se agrega al formData, de lo contrario solo se agrega la URL
        if (file) {
            formData.append('imagen', file);
        } else {
            formData.append('imagen_url', vehiculo.imagen_url);
        }
    
        // Agregar el resto de los campos relevantes
        formData.append('placa', vehiculo.placa);
        formData.append('n_tarjeta', vehiculo.n_tarjeta);
        formData.append('n_motor', vehiculo.n_motor);
        formData.append('marca', vehiculo.marca);
        formData.append('color', vehiculo.color);
        formData.append('ano_de_compra', vehiculo.ano_de_compra);
        formData.append('propietario1', vehiculo.propietario1);
    
        // Solo agregar propietario2 si tiene un valor
        if (vehiculo.propietario2) {
            formData.append('propietario2', vehiculo.propietario2);
        }
    
        try {
            if (tipo === "crear") {
                await registrarVehiculo(formData);
            } else if (tipo === "editar") {
                await actualizarVehiculo(vehiculoId, formData);
            }
            setLoading(false);
            onVehiculoUpdated();
            onClose();
        } catch (error) {
            setLoading(false);
            setErrores(error.response?.data.errors || {});
            alert(error.message || 'Error al procesar la solicitud');
        }
    };
    


    const handleSearchChange = (e) => {
        setPersonasFiltradas(personas.filter(persona => persona.dni.toLowerCase().includes(e.target.value.toLowerCase())));
    };

    const openModal = (campo) => {
        setCampoPropietario(campo);
        setModalVisible(true);
    };

    const closeModal = () => setModalVisible(false);

    const selectPropietario = (id) => {
        // Asignamos al campo correspondiente: propietario1 o propietario2
        setVehiculo({ ...vehiculo, [campoPropietario]: id });

        // Si se seleccionó el propietario2 y ya hay un valor en propietario1, asegurémonos de no sobrescribir
        if (campoPropietario === "propietario1" && vehiculo.propietario2 === id) {
            setVehiculo({ ...vehiculo, propietario2: "" }); // Limpiar propietario2 si es el mismo
        }

        closeModal();
    };


    const getNombrePropietario = (id) => personas.find(persona => persona.id === id)?.nombre || "Seleccionar propietario";

    return (
        isOpen && (
            <div className="vehiculo-modal">
                <div className="vehiculo-modal-content">
                    <h3>{tipo === "crear" ? "Registrar Vehículo" : "Editar Vehículo"}</h3>
                    <form onSubmit={handleSubmit} className="vehiculo-form">
                        {/* Fila para la imagen */}
                        <div className="vehiculo-form-row imagen-row">
                            <label>Imagen</label>
                            <input
                                type="file"
                                name="imagen"
                                onChange={handleFileChange}
                                accept="image/jpeg, image/png, image/gif"
                                className="vehiculo-input-file"
                            />
                        </div>

                        {/* Fila para los campos del vehículo */}
                        <div className="vehiculo-form-grid">
                            {["placa", "n_tarjeta", "n_motor", "marca", "color", "ano_de_compra"].map((field) => (
                                <div key={field} className="vehiculo-input-wrapper">
                                    <label>{field.replace('_', ' ').toUpperCase()}</label>
                                    <input
                                        type={field === "ano_de_compra" ? "number" : "text"}
                                        name={field}
                                        value={vehiculo[field]}
                                        onChange={handleInputChange}
                                        placeholder={field}
                                        required
                                        className="vehiculo-input"
                                    />
                                </div>
                            ))}
                        </div>


                        {/* Botones para seleccionar propietarios */}
                        {["propietario1", "propietario2"].map(campo => (
                            <button key={campo} type="button" onClick={() => openModal(campo)} className="vehiculo-select-button">
                                {getNombrePropietario(vehiculo[campo]) || campo.replace('propietario', 'Propietario ')}
                            </button>
                        ))}

                        {/* Modal para seleccionar propietarios */}
                        {modalVisible && (
                            <div className="vehiculo-modal-personas">
                                <div className="vehiculo-modal-personas-content">
                                    <button
                                        className="vehiculo-modal-personas-modal__close-btn"
                                        onClick={closeModal}>
                                        Cerrar
                                    </button>
                                    <input
                                        type="text"
                                        onChange={handleSearchChange}
                                        placeholder="Buscar por DNI"
                                        className="vehiculo-search-input"
                                    />
                                    <ul className="vehiculo-personas-list">
                                        {personasFiltradas.map(persona => (
                                            <li key={persona.id} className="vehiculo-persona-item">
                                                <button
                                                    type="button"
                                                    onClick={() => selectPropietario(persona.id)}
                                                    className="vehiculo-persona-button">
                                                    {persona.dni} - {persona.nombre}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Botones de submit y cerrar */}
                        <div className="vehiculo-button-container">
                            <button type="submit" disabled={loading} className="vehiculo-submit-button">
                                {loading ? "Cargando..." : tipo === "crear" ? "Registrar" : "Actualizar"}
                            </button>
                            <button onClick={onClose} className="vehiculo-close-button">Cerrar</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );


};

export default VehiculoModal;
