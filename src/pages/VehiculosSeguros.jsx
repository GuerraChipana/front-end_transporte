import React, { useState, useEffect } from 'react';
import { listarSegurosVehiculares } from '../services/vehiculo_seguros';
import { getUserRoleFromToken } from '../utils/authHelper';
import SeguroVehicularTabla from '../components/vehiculo_seguros/vSeguroTable';
import VehiculosSegurosModel from '../components/vehiculo_seguros/vSeguroModal';
import '../styles/seguros.css'

const SeguroVehiculares = () => {
  const rol = getUserRoleFromToken();
  const [seguros, setSeguros] = useState([]);
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
        setSeguros(segurosData);
      } catch (error) {
        console.error('Error al obtener los seguros vehiculares:', error);
      }
    };
    fetchSeguros();
  }, []);

  // Filter insurances by vehicle plate and active/inactive status
  const filtroSeguros = seguros.filter((seguro) =>
    seguro.id_vehiculo.placa.toLowerCase().includes(buscarPlaca.toLowerCase()) &&
    (mostrarActivos ? seguro.estado === 1 : seguro.estado === 0)
  );

  // Update the insurance list
  const handleUpdate = () => {
    const fetchSeguros = async () => {
      try {
        const segurosData = await listarSegurosVehiculares();
        setSeguros(segurosData);
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
          </button>)}
      </div>

      <SeguroVehicularTabla
        seguros={filtroSeguros}
        onEdit={(id) => {
          setSeguroId(id);
          setTipoModal('editar');
          setModalIsOpen(true);
        }}
        onChangeState={handleUpdate}  // Pass the update function to change state
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
