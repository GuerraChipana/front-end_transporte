import React, { useState, useEffect } from 'react';
import { registrarAseguradora, actualizarAseguradora, obtenerAseguradoraPorId } from '../../services/aseguradoras';
import '../../styles/Aseguradora.css';

const AseguradoraModal = ({ tipoModal, aseguradoraId, setModalIsOpen, onUpdate }) => {
  const [formData, setFormData] = useState({
    aseguradora: '',
  });

  const [errors, setErrors] = useState({
    aseguradora: '',
  });

  useEffect(() => {
    if (tipoModal === 'editar' && aseguradoraId) {
      const fetchAseguradora = async () => {
        try {
          const data = await obtenerAseguradoraPorId(aseguradoraId);
          setFormData({
            aseguradora: data.aseguradora,
          });
        } catch (error) {
          if (error.response && error.response.status === 404) {
            alert('Aseguradora no encontrada');
          } else {
            alert('Error al obtener aseguradora');
          }
        }
      };
      fetchAseguradora();
    } else {
      setFormData({ aseguradora: '' });
      setErrors({ aseguradora: '' });
    }
  }, [tipoModal, aseguradoraId]);

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

    setErrors({ aseguradora: '' });

    try {
      let response;
      if (tipoModal === 'crear') {
        response = await registrarAseguradora(formData);
      } else {
        response = await actualizarAseguradora(aseguradoraId, formData);
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

  return (
    <div className="aseguradora-modal-overlay">
      <div className="aseguradora-modal-content">
        <h3>{tipoModal === 'crear' ? 'Crear Aseguradora' : 'Editar Aseguradora'}</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Aseguradora</label>
            <input
              type="text"
              name="aseguradora"
              value={formData.aseguradora}
              onChange={handleChange}
              required
            />
            {errors.aseguradora && <p style={{ color: 'red' }}>{errors.aseguradora}</p>}
          </div>
          <button className="aseguradora-button" type="submit">{tipoModal === 'crear' ? 'Crear' : 'Actualizar'}</button>
          <button className="aseguradora-button" type="button" onClick={() => setModalIsOpen(false)}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AseguradoraModal;
