import { useState, useEffect } from "react";
import { listarAsociaciones } from "../../services/asociaciones";
import { listarVehiculos } from "../../services/vehiculos";
import { actualizarTuc, registrarTuc, obtenerTucPorId } from "../../services/tuc";
import '../../styles/tucModal.css';

const TucModal = ({ tipoModal, tucId, setModalIsOpen, onUpdate }) => {
  const [formData, setFormData] = useState({
    n_tuc: '',
    ano_tuc: '',
    id_asociacion: '',
    id_vehiculo: '',
    fecha_desde: '',
  });

  const [asociaciones, setAsociaciones] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [filteredData, setFilteredData] = useState({ asociaciones: [], vehiculos: [] });
  const [modalVisible, setModalVisible] = useState({ asociacion: false, vehiculo: false });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    n_tuc: '',
    ano_tuc: '',
    id_asociacion: '',
    id_vehiculo: '',
    fecha_desde: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [asociacionesData, vehiculosData] = await Promise.all([listarAsociaciones(), listarVehiculos()]);
        setAsociaciones(asociacionesData);
        setVehiculos(vehiculosData);
        setFilteredData({ asociaciones: asociacionesData, vehiculos: vehiculosData });

        if (tipoModal === "editar" && tucId) {
          const tucData = await obtenerTucPorId(tucId);
          setFormData({
            n_tuc: tucData.n_tuc,
            ano_tuc: tucData.ano_tuc,
            fecha_desde: tucData.fecha_desde,
            id_asociacion: tucData.id_asociacion?.id || "",
            id_vehiculo: tucData.id_vehiculo?.id || "",
          });
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          alert("Error loading data:", error);
        }
      }
    };
    loadData();
  }, [tipoModal, tucId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'n_tuc' || name === 'ano_tuc') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? Number(value) : ""
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSearchChange = (e, tipo) => {
    const searchValue = e.target.value.toLowerCase();
    setFilteredData(prev => ({
      ...prev,
      [tipo]: tipo === "asociaciones"
        ? asociaciones.filter(item => item.nombre.toLowerCase().includes(searchValue))
        : vehiculos.filter(item => item.placa.toLowerCase().includes(searchValue))
    }));
  };

  const openModal = (campo) => setModalVisible(prev => ({ ...prev, [campo]: true }));

  const selectOption = (id, tipo) => {
    const selected = tipo === "asociacion" ? asociaciones.find(item => item.id === id) : vehiculos.find(item => item.id === id);
    setFormData(prev => ({ ...prev, [`id_${tipo}`]: selected.id }));
    setModalVisible(prev => ({ ...prev, [tipo]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      const formDataToSend = {
        ...formData,
        n_tuc: Number(formData.n_tuc),
        ano_tuc: Number(formData.ano_tuc),
      };
      setLoading(true);
      if (tipoModal === "crear") {
        response = await registrarTuc(formDataToSend);
      } else if (tipoModal === "editar") {
        response = await actualizarTuc(tucId, formDataToSend);
      }
      setLoading(false);
      onUpdate();
      setModalIsOpen(false);
    } catch (error) {
      setLoading(false);
      if (error.response) {
        const backendErrors = error.response.data.errors || {};
        setErrors(backendErrors);
      } else {
        alert(error.message || 'Error al procesar la solicitud');
      }
    }
  };

  // Función para manejar el "Cancelar"
  const handleCancel = () => {
    setModalIsOpen(false); // Cerrar el modal sin hacer cambios
  };

  const fields = [
    { label: 'N° Tuc', name: 'n_tuc' },
    { label: 'Año de Tuc', name: 'ano_tuc' },
  ];

  return (
    <div className="tuc-modal-container-custom visible">
      <div className="tuc-modal-content">
        <h3 className="tuc-modal-content-title">{tipoModal === "crear" ? "Registrar nuevo Tuc" : "Editar Tuc"}</h3>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.name}>
              <label>{field.label}</label>
              <input
              className="tuc-NTUC_Compra"
                type="number"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
              />
              {errors[field.name] && <p style={{ color: 'red' }}>{errors[field.name]}</p>}
            </div>
          ))}

          <button type="button" className="tuc-seleccionar" onClick={() => openModal("asociacion")}>
            {formData.id_asociacion ? `Asociación: ${asociaciones.find(a => a.id === formData.id_asociacion)?.nombre}` : "Seleccionar Asociación"}
          </button>

          <button type="button" className="tuc-seleccionar" onClick={() => openModal("vehiculo")}>
            {formData.id_vehiculo ? `Vehículo: ${vehiculos.find(v => v.id === formData.id_vehiculo)?.placa}` : "Seleccionar Vehículo"}
          </button>
          <div>
            <label>Fecha Desde</label>
            <input type="date" name="fecha_desde" value={formData.fecha_desde} onChange={handleChange} required />
          </div>

          <div className="form-actions">
            <button type="submit" className="tuc-guardar" disabled={loading}>
              Guardar
            </button>
            <button type="button" className="tuc-cancelar" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </form>

        {/* Modal de Asociación */}
        {modalVisible.asociacion && (
          <div className="tuc-modal-container-busqueda visible">
            <div className="tuc-modal-content-busqueda">
              <button className="tuc-modal-close" onClick={() => setModalVisible(prev => ({ ...prev, asociacion: false }))}>Cerrar</button>
              <div className="tuc-modal-buscar">
                <input type="text" onChange={(e) => handleSearchChange(e, "asociaciones")} placeholder="Buscar Asociación" />
                <ul>
                  {filteredData.asociaciones.map(asociacion => (
                    <li key={asociacion.id}>
                      <button onClick={() => selectOption(asociacion.id, "asociacion")}>{asociacion.nombre}</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Vehículo */}
        {modalVisible.vehiculo && (
          <div className="tuc-modal-container-busqueda visible">
            <div className="tuc-modal-content-busqueda">
              <button className="tuc-modal-close" onClick={() => setModalVisible(prev => ({ ...prev, vehiculo: false }))}>Cerrar</button>
              <div className="tuc-modal-buscar">
                <input type="text" onChange={(e) => handleSearchChange(e, "vehiculos")} placeholder="Buscar Placa de Vehículo" />
                <ul>
                  {filteredData.vehiculos.map(vehiculo => (
                    <li key={vehiculo.id}>
                      <button onClick={() => selectOption(vehiculo.id, "vehiculo")}>{vehiculo.placa}</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TucModal;
