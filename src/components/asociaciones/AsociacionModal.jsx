import { useState, useEffect } from 'react';
import { registrarAsociacion, actualizarAsociacion, obtenerAsociacionPorId } from '../../services/asociaciones';
import '../../styles/asociacionesModal.css'

const AsociacionModal = ({ tipoModal, asociacionId, setModalIsOpen, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: '', documento: '',
  });

  const [errors, setErrors] = useState({ nombre: '', documento: '' });

  useEffect(() => {
    if (tipoModal === 'editar' && asociacionId) {
      const fetchAsociacion = async () => {
        try {
          const data = await obtenerAsociacionPorId(asociacionId);
          setFormData({ nombre: data.nombre, documento: data.documento });
        } catch (error) {
          if (error.response && error.response.status === 404) {
            alert('Asociación no encontrada');
          } else {
            alert('Error al obtener asociación');
          }
        }
      };
      fetchAsociacion();
    } else {
      setFormData({ nombre: '', documento: '' });
      setErrors({ nombre: '', documento: '' });
    }
  }, [tipoModal, asociacionId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ nombre: '', documento: '' }); // Limpiar errores

    try {
      let response;
      if (tipoModal === 'crear') {
        response = await registrarAsociacion(formData);
      } else {
        response = await actualizarAsociacion(asociacionId, formData);
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
    }
  };

  const fields = [
    { label: 'Nombre de Asociación', name: 'nombre' },
    { label: 'Documento', name: 'documento' },
  ];

  // Renderiza el modal solo si `setModalIsOpen` es verdadero
  if (!setModalIsOpen) return null; // Si el modal no debe ser visible, no se renderiza nada

  return (
    <div className="modal-asociacion-container-v1">
      <div className="modal-asociacion-content-v1">
        <h3 className='modal-asociacion-title-v1'>{tipoModal === 'crear' ? 'Registrar Seguro Vehicular' : 'Editar Seguro Vehicular'}</h3>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.name} className="modal-asociacion-field-v1">
              <label className="modal-asociacion-label-v1">{field.label}</label>
              <input
                className="modal-asociacion-input-v1"
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
              />
              {errors[field.name] && <p className="modal-asociacion-error-v1">{errors[field.name]}</p>}
            </div>
          ))}
          <button className="modal-asociacion-button-submit-v1" type="submit">
            {tipoModal === 'crear' ? 'Crear' : 'Actualizar'}
          </button>
          <button className="modal-asociacion-button-cancel-v1" type="button" onClick={() => setModalIsOpen(false)}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AsociacionModal;
