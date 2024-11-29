import React, { useState, useEffect } from "react";
import { listarPersonas } from "../../services/personas"; // Función para obtener personas
import { registrarVehiculo, actualizarVehiculo, obtenerVehiculoPorId } from "../../services/vehiculos"; // Funciones para gestionar vehículos
import { validateVehiculo } from "../../utils/validationHelper"; // Función de validación

const VehiculoModal = ({ tipo, vehiculoId, isOpen, onClose, onVehiculoUpdated }) => {
    const [vehiculo, setVehiculo] = useState({
        imagen_url: "",
        placa: "",
        n_tarjeta: "",
        n_motor: "",
        marca: "",
        color: "",
        ano_de_compra: "",
        propietario1: "", // ID del propietario 1
        propietario2: "", // ID del propietario 2
    });
    const [personas, setPersonas] = useState([]); // Almacenar personas
    const [personasFiltradas, setPersonasFiltradas] = useState([]); // Personas filtradas para búsqueda
    const [errores, setErrores] = useState([]); // Errores de validación
    const [loading, setLoading] = useState(false); // Estado de carga
    const [file, setFile] = useState(null); // Para la imagen
    const [modalVisible, setModalVisible] = useState(false); // Mostrar modal de búsqueda
    const [campoPropietario, setCampoPropietario] = useState(""); // Indicar qué propietario estamos seleccionando

    useEffect(() => {
        if (isOpen) {
            // Si el modal está abierto y el tipo es 'crear', restablecer el estado del formulario
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
                setFile(null); // Limpiar el archivo de imagen
                setErrores([]); // Limpiar los errores de validación
            }

            const cargarPersonas = async () => {
                try {
                    const personasData = await listarPersonas();
                    setPersonas(personasData);
                    setPersonasFiltradas(personasData);
                } catch (error) {
                }
            };
            cargarPersonas();

            // Cargar el vehículo si es para editar
            if (tipo === "editar" && vehiculoId) {
                const cargarVehiculo = async () => {
                    try {
                        const vehiculoData = await obtenerVehiculoPorId(vehiculoId);

                        // Asignar correctamente los ID de los propietarios
                        const propietario1 = vehiculoData.propietario1 ? vehiculoData.propietario1.id : "";
                        const propietario2 = vehiculoData.propietario2 ? vehiculoData.propietario2.id : "";

                        setVehiculo({
                            ...vehiculoData,
                            propietario1, // Asignamos el ID del propietario 1
                            propietario2, // Asignamos el ID del propietario 2
                        });
                    } catch (error) {
                    }
                };
                cargarVehiculo();
            }
        }
    }, [isOpen, tipo, vehiculoId]); // Dependencias para recargar cuando cambien estos valores

    // Manejo de cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehiculo({ ...vehiculo, [name]: value });
    };

    // Manejo de la carga de archivo (imagen)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    // Manejo del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateVehiculo(vehiculo);

        if (validationErrors.length > 0) {
            setErrores(validationErrors);
        } else {
            try {
                setLoading(true);

                const formData = new FormData();
                formData.append("placa", vehiculo.placa);
                formData.append("n_tarjeta", vehiculo.n_tarjeta);
                formData.append("n_motor", vehiculo.n_motor);
                formData.append("marca", vehiculo.marca);
                formData.append("color", vehiculo.color);
                formData.append("ano_de_compra", vehiculo.ano_de_compra);
                formData.append("propietario1", vehiculo.propietario1 || "");
                formData.append("propietario2", vehiculo.propietario2 || "");

                if (file) {
                    formData.append("imagen", file);
                }

                if (tipo === "crear") {
                    await registrarVehiculo(formData);
                } else if (tipo === "editar") {
                    await actualizarVehiculo(vehiculoId, formData);
                }

                setLoading(false);
                onVehiculoUpdated(); // Actualiza la lista de vehículos
                onClose(); // Cierra el modal
            } catch (error) {
                setLoading(false);
                if (error.response) {
                    const backendErrors = error.response.data.errors || {};
                    setErrores(backendErrors);
                } else {
                    alert(error.message || 'Error al procesar la solicitud');
                }
            }
        }
    };


    // Filtrar personas según el DNI
    const handleSearchChange = (e) => {
        const searchValue = e.target.value.toLowerCase();
        const filtered = personas.filter((persona) =>
            persona.dni.toLowerCase().includes(searchValue)
        );
        setPersonasFiltradas(filtered);
    };

    // Abrir el modal para seleccionar un propietario
    const openModal = (campo) => {
        setCampoPropietario(campo); // Establecer cuál campo se va a completar (propietario1 o propietario2)
        setModalVisible(true);
    };

    // Seleccionar un propietario y cerrar el modal
    const selectPropietario = (id) => {
        setVehiculo({
            ...vehiculo,
            [campoPropietario]: id, // Asignar solo el ID
        });
        setModalVisible(false); // Cerrar el modal después de seleccionar
    };

    // Función para obtener el nombre del propietario
    const getNombrePropietario = (id) => {
        const propietario = personas.find((persona) => persona.id === id);
        return propietario ? propietario.nombre : "Seleccionar propietario";
    };

    return (
        isOpen && (
            <div className="modal">
                <div className="modal-content">
                    <h3>{tipo === "crear" ? "Registrar Vehículo" : "Editar Vehículo"}</h3>
                    {errores.length > 0 && (
                        <ul>
                            {errores.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    )}
                    <form onSubmit={handleSubmit}>
                        <input type="file" name="imagen" onChange={handleFileChange} accept="image/*" />
                        <input type="text" name="placa" value={vehiculo.placa} onChange={handleChange} placeholder="Placa" required />
                        <input type="text" name="n_tarjeta" value={vehiculo.n_tarjeta} onChange={handleChange} placeholder="Número de tarjeta" required />
                        <input type="text" name="n_motor" value={vehiculo.n_motor} onChange={handleChange} placeholder="Número de motor" required />
                        <input type="text" name="marca" value={vehiculo.marca} onChange={handleChange} placeholder="Marca" required />
                        <input type="text" name="color" value={vehiculo.color} onChange={handleChange} placeholder="Color" required />
                        <input type="number" name="ano_de_compra" value={vehiculo.ano_de_compra} onChange={handleChange} placeholder="Año de compra" required />

                        <button type="button" onClick={() => openModal("propietario1")}>
                            {getNombrePropietario(vehiculo.propietario1) || "Propietario 1"}
                        </button>

                        <button type="button" onClick={() => openModal("propietario2")}>
                            {getNombrePropietario(vehiculo.propietario2) || "Propietario 2"}
                        </button>

                        {modalVisible && (
                            <div className="modal-personas">
                                <input type="text" onChange={handleSearchChange} placeholder="Buscar por DNI" />
                                <ul>
                                    {personasFiltradas.map((persona) => (
                                        <li key={persona.id}>
                                            <button type="button" onClick={() => selectPropietario(persona.id)}>
                                                {persona.dni} - {persona.nombre}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button type="submit" disabled={loading}>
                            {loading ? "Cargando..." : tipo === "crear" ? "Registrar" : "Actualizar"}
                        </button>
                    </form>
                    <button onClick={onClose}>Cerrar</button>
                </div>
            </div>
        )
    );
};

export default VehiculoModal;
