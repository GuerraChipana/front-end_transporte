import React, { useState, useEffect } from 'react';
import { listarSegurosVehiculares } from '../services/vehiculo_seguros';
import { getUserRoleFromToken } from '../utils/authHelper';
import SeguroVehicularTabla from '../components/vehiculo_seguros/vSeguroTable';
import VehiculosSegurosModel from '../components/vehiculo_seguros/vSeguroModal';
import '../styles/seguros.css';

const SeguroVehiculares = () => {
  const rol = getUserRoleFromToken();
  const [seguros, setSeguros] = useState([]);  // Inicializamos como un array vacío
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState('crear');
  const [seguroId, setSeguroId] = useState(null);
  const [buscarPlaca, setBuscarPlaca] = useState('');
  const [mostrarActivos, setMostrarActivos] = useState(true); // Estado para filtrar por seguros activos o inactivos

  // Fetch all insurances on mount
  useEffect(() => {
    const fetchSeguros = async () => {
      try {
        const segurosData = await listarSegurosVehiculares();
        
        // Verificamos que la respuesta sea un array
        if (Array.isArray(segurosData)) {
          setSeguros(segurosData);  // Si es un array, actualizamos el estado
        } else {
          console.error('Error: la respuesta no es un array', segurosData);
          setSeguros([]);  // Si no es un array, establecemos un array vacío
        }
      } catch (error) {
        console.error('Error al obtener los seguros vehiculares:', error);
        setSeguros([]);  // En caso de error, establecemos un array vacío
      }
    };
    fetchSeguros();
  }, []);  // Este useEffect se ejecuta solo una vez cuando el componente se monta

  // Filtrar seguros por placa y estado activo/inactivo
  const filtroSeguros = seguros.filter((seguro) =>
    seguro.id_vehiculo.placa.toLowerCase().includes(buscarPlaca.toLowerCase()) &&
    (mostrarActivos ? seguro.estado === 1 : seguro.estado === 0)
  );

  // Actualizar la lista de seguros
  const handleUpdate = () => {
    const fetchSeguros = async () => {
      try {
        const segurosData = await listarSegurosVehiculares();

        // Verificamos que la respuesta sea un array
        if (Array.isArray(segurosData)) {
          setSeguros(segurosData);
        } else {
          console.error('Error: la respuesta no es un array', segurosData);
        }
      } catch (error) {
        console.error('Error al obtener los seguros vehiculares:', error);
      }
    };
    fetchSeguros();
  };

  return (
    <div className="seguro-vehicular-gestion-container">
      <h2>Gestión de Seguros Vehiculares</h2>

      <div className="seguro-vehicular-search-container">
        <input
          type="text"
          placeholder="Buscar por Placa"
          value={buscarPlaca}
          onChange={(e) => setBuscarPlaca(e.target.value)}
        />
      </div>

      <div className="seguro-vehicular-buttons-container">
        {/* Botón para activar/desactivar los filtros de activos/inactivos */}
        <button
          className="seguro-vehicular-button"
          onClick={() => setMostrarActivos(!mostrarActivos)}
        >
          {mostrarActivos ? 'Ver Inactivos' : 'Ver Activos'}
        </button>

        {(rol === "superadministrador" || rol === "administrador") && (
          <button
            className="seguro-vehicular-button seguro-vehicular-button-create"
            onClick={() => { setModalIsOpen(true); setTipoModal('crear'); }}
          >
            Crear Seguro Vehicular
          </button>
        )}
      </div>

      <SeguroVehicularTabla
        seguros={filtroSeguros}
        onEdit={(id) => {
          setSeguroId(id);
          setTipoModal('editar');
          setModalIsOpen(true);
        }}
        onChangeState={handleUpdate}  // Pasamos la función para actualizar el estado
      />

      {modalIsOpen && (
        <VehiculosSegurosModel
          tipoModal={tipoModal}
          seguroId={seguroId}
          setModalIsOpen={setModalIsOpen}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default SeguroVehiculares;
