import { useState, useEffect } from "react"
import { listarAsociaciones } from "../../services/asociaciones"
import { listarVehiculos } from "../../services/vehiculos"
import { actualizarTuc, registrarTuc, obtenerTucPorId } from "../../services/tuc";

const TucModal = ({ tipoModal, tucId, setModalIsOpen, onUpdate }) => {
  const [formData, setFormData] = useState({
    n_tuc: "",
    ano_tuc: "",
    id_asociacion: "",
    id_vehiculo: "",
    fecha_desde: "",
  });


  const [asociaciones, setAsociaciones] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [filteredData, setFilteredData] = useState({ asociaciones: [], vehiculos: [] });
  const [modalVisible, setModalVisible] = useState({ asociacion: false, vehiculo: false });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    n_tuc: "",
    ano_tuc: "",
    id_asociacion: "",
    id_vehiculo: "",
    fecha_desde: "",
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
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, [tipoModal, tucId]);

  // manejar el cambio 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // manejar el cambio de búsqueda
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
      console.log("Datos del formulario:", formData); // Aquí se muestra el estado del formulario
      // Asegurarte de que los campos numéricos sean números
      const formDataToSend = {
        ...formData,
        n_tuc: formData.n_tuc ? Number(formData.n_tuc) : "",  // Asegúrate de que sea un número
        ano_tuc: formData.ano_tuc ? Number(formData.ano_tuc) : "",  // Asegúrate de que sea un número
      };
      setLoading(true);
      if (tipoModal === "crear") {
        await registrarTuc(formDataToSend);
      } else if (tipoModal === "editar") {
        await actualizarTuc(tucId, formDataToSend);
      }
      setLoading(false);
      onUpdate();
      setModalIsOpen(false);
    } catch (error) {
      setLoading(false);
      setErrors([error.message || "Hubo un error al guardar el seguro."]);
    }
  };

  const fields = [
    { label: 'N° Tuc', name: 'n_tuc' },
    { label: 'Año de Tuc', name: 'ano_tuc' },
  ];

  return (
    <div>
      <h3>{tipoModal === "crear" ? "Registrar nuevo Tuc" : "Editar Tuc"}</h3>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name}>
            <label>{field.label}</label>
            <input
              type="number"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
            />
            {errors[field.name] && <p style={{ color: 'red' }}>{errors[field.name]}</p>}
          </div>
        ))}

        <button type="button" onClick={() => openModal("asociacion")}>
          {formData.id_asociacion ? `Asociación: ${asociaciones.find(a => a.id === formData.id_asociacion)?.nombre}` : "Seleccionar Asociación"}
        </button>

        <button type="button" onClick={() => openModal("vehiculo")}>
          {formData.id_vehiculo ? `Vehículo: ${vehiculos.find(v => v.id === formData.id_vehiculo)?.placa}` : "Seleccionar Vehículo"}
        </button>

        <div>
          <label>Fecha Desde</label>
          <input type="date" name="fecha_desde" value={formData.fecha_desde} onChange={handleChange} required />
        </div>

        <button type="submit" disabled={loading}>Guardar</button>
      </form>

      {modalVisible.asociacion && (
        <div className="modal-buscar">
          <input type="text" onChange={(e) => handleSearchChange(e, "asociaciones")} placeholder="Buscar Asociación" />
          <ul>
            {filteredData.asociaciones.map(asociacion => (
              <li key={asociacion.id}>
                <button onClick={() => selectOption(asociacion.id, "asociacion")}>{asociacion.nombre}</button>
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

export default TucModal