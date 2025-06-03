import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/inicio.css';
import { busquedaPlaca, busquedaEmpadronamiento } from '../services/buscqueda';

function Inicio() {
  const [resultadosPlaca, setResultadosPlaca] = useState(null);
  const [resultadosEmpadronamiento, setResultadosEmpadronamiento] = useState(null);
  const [placa, setPlaca] = useState('');
  const [empadronamiento, setEmpadronamiento] = useState('');
  const [error, setError] = useState(null);
  const [mostrarPlaca, setMostrarPlaca] = useState(true);
  const [mostrarEmpadronamiento, setMostrarEmpadronamiento] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Cada vez que cambie location.search, extraemos parámetros y disparamos búsqueda
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const placaParam = params.get('placa');
    const empParam = params.get('empadronamiento');

    if (placaParam) {
      // Si hay ?placa=..., ejecutamos búsqueda por placa
      setPlaca(placaParam);
      setMostrarEmpadronamiento(false);
      setResultadosEmpadronamiento(null);
      setError(null);

      busquedaPlaca(placaParam)
        .then(data => {
          setResultadosPlaca(data);
        })
        .catch(err => {
          setError(err.message);
        });
    } else {
      // Si no hay placa en URL, limpiamos resultados de placa
      setResultadosPlaca(null);
      setMostrarPlaca(true);
    }

    if (empParam) {
      // Si hay ?empadronamiento=..., ejecutamos búsqueda por empadronamiento
      setEmpadronamiento(empParam);
      setMostrarPlaca(false);
      setResultadosPlaca(null);
      setError(null);

      busquedaEmpadronamiento(empParam)
        .then(data => {
          setResultadosEmpadronamiento(data);
        })
        .catch(err => {
          setError(err.message);
        });
    } else {
      // Si no hay empadronamiento en URL, limpiamos resultados de empadronamiento
      setResultadosEmpadronamiento(null);
      setMostrarEmpadronamiento(true);
    }
  }, [location.search]);

  // Al hacer clic en "Buscar" de placa, actualizamos la URL para incluir ?placa=...
  const handleSearchPlaca = () => {
    if (!placa.trim()) return;
    navigate(`/inicio?placa=${encodeURIComponent(placa.trim())}`);
  };

  // Al hacer clic en "Buscar" de empadronamiento, actualizamos la URL para incluir ?empadronamiento=...
  const handleSearchEmpadronamiento = () => {
    if (!empadronamiento.trim()) return;
    navigate(`/inicio?empadronamiento=${encodeURIComponent(empadronamiento.trim())}`);
  };

  const handleClear = () => {
    // Limpiar estado local y quitar query params de la URL
    setPlaca('');
    setEmpadronamiento('');
    setResultadosPlaca(null);
    setResultadosEmpadronamiento(null);
    setError(null);
    setMostrarPlaca(true);
    setMostrarEmpadronamiento(true);
    navigate('/inicio', { replace: true });
  };

  const renderSeguros = (vehiculosSeguros) => {
    if (vehiculosSeguros && Array.isArray(vehiculosSeguros)) {
      return vehiculosSeguros.map((seguro, index) => (
        <div key={index} className="resultado-card-seguro">
          <h4>Seguro Vehicular:</h4>
          <p><strong>N° Póliza: </strong> {seguro.n_poliza}</p>
          <p><strong>Estado de vencimiento: </strong> {seguro.estado_vencimiento}</p>
          <p><strong>Fecha de vigencia hasta: </strong> {seguro.fecha_vigencia_hasta}</p>
        </div>
      ));
    } else {
      return <p>No hay vehículos seguros disponibles.</p>;
    }
  };

  const renderPropietarios = (propietarios) => {
    if (propietarios) {
      return (
        <div className="resultado-card-propietarios">
          <h4>Propietarios:</h4>
          {Object.keys(propietarios).map((key) => {
            const p = propietarios[key];
            return (
              <p key={key}>{`${p.nombre} ${p.apPaterno} ${p.apMaterno}`}</p>
            );
          })}
        </div>
      );
    } else {
      return <p>No hay propietarios disponibles.</p>;
    }
  };

  return (
    <div className="inicio-container">
      <h1 className="inicio-title">
        <img src="/logo-mdati.png" width={400} alt="Logo" />
      </h1>

      {error && <div className="inicio-error">{error}</div>}

      <div className="busqueda-container">
        {/* Buscar por Placa */}
        <div className={`busqueda-placa-section ${!mostrarPlaca ? 'hidden' : ''}`}>
          <h2>Buscar por Placa</h2>
          <div className="busqueda-placa-input-group">
            <input
              type="text"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              placeholder="Ingresa la placa del vehículo"
              className="busqueda-placa-input"
            />
            <button className="busqueda-placa-button" onClick={handleSearchPlaca}>
              Buscar
            </button>
          </div>
        </div>

        {/* Buscar por Empadronamiento */}
        <div className={`busqueda-empadronamiento-section ${!mostrarEmpadronamiento ? 'hidden' : ''}`}>
          <h2>Buscar por Empadronamiento</h2>
          <div className="busqueda-empadronamiento-input-group">
            <input
              type="text"
              value={empadronamiento}
              onChange={(e) => setEmpadronamiento(e.target.value)}
              placeholder="Ingresa el número de empadronamiento"
              className="busqueda-empadronamiento-input"
            />
            <button className="busqueda-empadronamiento-button" onClick={handleSearchEmpadronamiento}>
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Resultados de Placa */}
      {resultadosPlaca && resultadosPlaca.vehiculo && (
        <div className="resultado-card">
          <div className="resultado-card-info">
            <h3>Detalles del Vehículo</h3>
            <p><strong>N° Empadronamiento: </strong> {resultadosPlaca.empadronamiento?.n_empadronamiento || 'No disponible'}</p>
            <p><strong>N° Placa: </strong> {resultadosPlaca.vehiculo?.placa || 'No disponible'}</p>
            <p><strong>Marca: </strong> {resultadosPlaca.vehiculo?.marca || 'No disponible'}</p>
            <p><strong>N° Tarjeta: </strong> {resultadosPlaca.vehiculo?.n_tarjeta || 'No disponible'}</p>
            <p><strong>Asociación: </strong> {resultadosPlaca.asociacion || 'No disponible'}</p>
            <p><strong>N° TUC: </strong> {resultadosPlaca.numeroTuc || 'No disponible'}</p>
            <p><strong>Estado de Tuc: </strong> {resultadosPlaca.estadoVigenciaTuc || 'No disponible'}</p>
          </div>
          <img
            className="resultado-card-image"
            src={resultadosPlaca.vehiculo?.imagen_url || ''}
            alt={resultadosPlaca.vehiculo?.marca || 'Imagen no disponible'}
          />
          {renderSeguros(resultadosPlaca.vehiculosSeguros)}
          {renderPropietarios(resultadosPlaca.propietarios)}
        </div>
      )}

      {/* Resultados de Empadronamiento */}
      {resultadosEmpadronamiento && resultadosEmpadronamiento.vehiculo && (
        <div className="resultado-card">
          <div className="resultado-card-info">
            <h3>Detalles del Vehículo</h3>
            <p><strong>N° Empadronamiento: </strong> {resultadosEmpadronamiento.n_empadronamiento || 'No disponible'}</p>
            <p><strong>Placa: </strong> {resultadosEmpadronamiento.vehiculo?.placa || 'No disponible'}</p>
            <p><strong>Marca: </strong> {resultadosEmpadronamiento.vehiculo?.marca || 'No disponible'}</p>
            <p><strong>N° Tarjeta: </strong> {resultadosEmpadronamiento.vehiculo?.n_tarjeta || 'No disponible'}</p>
            <p><strong>Asociación: </strong> {resultadosEmpadronamiento.asociacion || 'No disponible'}</p>
            <p><strong>N° TUC: </strong> {resultadosEmpadronamiento.numeroTuc || 'No disponible'}</p>
            <p><strong>Estado de TUC: </strong> {resultadosEmpadronamiento.estadoVigenciaTuc || 'No disponible'}</p>
          </div>
          <img
            className="resultado-card-image"
            src={resultadosEmpadronamiento.vehiculo?.imagen_url || ''}
            alt={resultadosEmpadronamiento.vehiculo?.marca || 'Imagen no disponible'}
          />
          {renderSeguros(resultadosEmpadronamiento.vehiculosSeguros)}
          {renderPropietarios(resultadosEmpadronamiento.propietarios)}
        </div>
      )}

      <div className="inicio-clear-button-container">
        <button className="inicio-clear-button" onClick={handleClear}>
          Limpiar Búsqueda
        </button>
      </div>
    </div>
  );
}

export default Inicio;
