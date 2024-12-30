import { useState, useEffect } from "react";
import { buscarPersona, registrarPersona, actualizarPersona } from "../../services/personas.js";
import '../../styles/personasModal.css';

const PersonasModal = ({ tipoModal, personaId, setModalIsOpen, onUpdate, personaData }) => {
    const [formData, setFormData] = useState({
        telefono: "",
        email: "",
        dni: "",
        nombre: "",
        apPaterno: "",
        apMaterno: "",
        direccion: "",
        ubigeo: "",
        foto: "",
        password_consulta: "", // Para realizar la búsqueda
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (tipoModal === "editar" && personaData) {
            setFormData({
                telefono: personaData.telefono || "",
                email: personaData.email || "",
                dni: personaData.dni || "",
                nombre: personaData.nombre || "",
                apPaterno: personaData.apPaterno || "",
                apMaterno: personaData.apMaterno || "",
                direccion: personaData.domicilio || "",
                ubigeo: personaData.ubigeo || "",
                foto: personaData.foto || "",
                password_consulta: "",
            });
        }
    }, [tipoModal, personaData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let dataToSend = {};

            // Desestructuramos los campos y aseguramos que 'email' no se envíe si está vacío
            const { email, password_consulta, ...rest } = formData;

            if (email.trim() !== "") {
                dataToSend = { ...rest, email };
            } else {
                dataToSend = { ...rest };
            }

            if (tipoModal === "crear") {
                await registrarPersona(dataToSend);
            } else if (tipoModal === "editar") {
                const { nombre, apPaterno, apMaterno, ubigeo, foto, dni, direccion, password_consulta, ...dataToSendEdit } = formData;

                dataToSend = { ...dataToSendEdit, domicilio: direccion };
                await actualizarPersona(personaId, dataToSend);
            }

            onUpdate();  // Llamamos a la función de actualización del estado
            setModalIsOpen(false);  // Cerramos el modal
        } catch (err) {
            setError("Error al guardar los datos.");
        } finally {
            setLoading(false);  // Terminamos la carga
        }
    };

    const buscarDatosPersona = async () => {
        setLoading(true);
        try {
            const persona = await buscarPersona(formData.dni, formData.password_consulta);
            setFormData({
                ...formData,
                nombre: persona.nombre || "",
                apPaterno: persona.apPaterno || "",
                apMaterno: persona.apMaterno || "",
                direccion: persona.direccion || "",
                ubigeo: persona.ubigeo || "",
                foto: persona.foto || "",
                email: persona.email || "",
                telefono: persona.telefono || ""
            });
        } catch (err) {
            setError("No se encontraron datos para el DNI y contraseña proporcionados.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setModalIsOpen(false); // Cerrar el modal sin hacer nada
    };

    return (
        <div className="personas-modal-container">
            <div className="personas-modal-content">
                <h2 className="personas-modal-header">{tipoModal === "crear" ? "Registrar Persona" : "Editar Persona"}</h2>

                <div className="personas-form-section">
                    {tipoModal === "crear" && (
                        <>
                            <div className="form-group">
                                <label className="personas-modal-label">DNI:</label>
                                <input
                                    className="personas-modal-input"
                                    type="text"
                                    name="dni"
                                    value={formData.dni}
                                    onChange={handleChange}
                                    placeholder="Ingrese el DNI"
                                    required                         disabled={tipoModal === "editar"}

                                />
                            </div>
                            <div className="form-group">
                                <label className="personas-modal-label">Contraseña de Consulta:</label>
                                <input
                                    className="personas-modal-input"
                                    type="password"
                                    name="password_consulta"
                                    value={formData.password_consulta}
                                    onChange={handleChange}
                                    placeholder="Ingrese la contraseña"
                                    required
                                />
                            </div>
                            <button className="personas-modal-button" onClick={buscarDatosPersona} disabled={loading}>
                                {loading ? "Cargando datos..." : "Autocompletar datos"}
                            </button>
                        </>
                    )}

                    <div className="form-group">
                        <label className="personas-modal-label">Nombre:</label>
                        <input
                            className="personas-modal-input"
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ingrese el nombre"
                            required                         disabled={tipoModal === "editar"}

                        />
                    </div>

                    <div className="form-group">
                        <label className="personas-modal-label">Apellido Paterno:</label>
                        <input
                            className="personas-modal-input"
                            type="text"
                            name="apPaterno"
                            value={formData.apPaterno}
                            onChange={handleChange}
                            placeholder="Ingrese el apellido paterno"
                            required                         disabled={tipoModal === "editar"}

                        />
                    </div>

                    <div className="form-group">
                        <label className="personas-modal-label">Apellido Materno:</label>
                        <input
                            className="personas-modal-input"
                            type="text"
                            name="apMaterno"
                            value={formData.apMaterno}
                            onChange={handleChange}
                            placeholder="Ingrese el apellido materno"
                            required                         disabled={tipoModal === "editar"}

                        />
                    </div>

                    <div className="form-group">
                        <label className="personas-modal-label">Dirección:</label>
                        <input
                            className="personas-modal-input"
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            placeholder="Ingrese la dirección"
                            required
                            
                        />
                    </div>

                    <div className="form-group">
                        <label className="personas-modal-label">Ubigeo:</label>
                        <input
                            className="personas-modal-input"
                            type="text"
                            name="ubigeo"
                            value={formData.ubigeo}
                            onChange={handleChange}
                            placeholder="Ingrese el ubigeo"
                            required                         disabled={tipoModal === "editar"}

                        />
                    </div>

                    <div className="form-group">
                        <label className="personas-modal-label">Email:</label>
                        <input
                            className="personas-modal-input"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Ingrese el email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="personas-modal-label">Teléfono:</label>
                        <input
                            className="personas-modal-input"
                            type="text"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            placeholder="Ingrese el teléfono"
                        />
                    </div>

                    <button className="personas-modal-button" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Guardando..." : tipoModal === "crear" ? "Registrar" : "Actualizar"}
                    </button>

                    <button className="personas-modal-cancel-button" onClick={handleClose}>
                        Cancelar
                    </button>
                </div>

                {error && <p className="personas-error-message">{error}</p>}
            </div>
        </div>
    );
};

export default PersonasModal;

