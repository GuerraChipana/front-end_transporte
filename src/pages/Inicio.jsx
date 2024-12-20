import React, { useState } from 'react';
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

    const handleSearchPlaca = async () => {
        setMostrarEmpadronamiento(false);  // Ocultar el formulario de empadronamiento
        setResultadosEmpadronamiento(null);
        setError(null);
        try {
            const data = await busquedaPlaca(placa);
            setResultadosPlaca(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSearchEmpadronamiento = async () => {
        setMostrarPlaca(false);  // Ocultar el formulario de placa
        setResultadosPlaca(null);
        setError(null);
        try {
            const data = await busquedaEmpadronamiento(empadronamiento);
            setResultadosEmpadronamiento(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleClear = () => {
        setPlaca('');
        setEmpadronamiento('');
        setResultadosPlaca(null);
        setResultadosEmpadronamiento(null);
        setError(null);
        setMostrarPlaca(true);
        setMostrarEmpadronamiento(true);
    };

    const renderSeguros = (vehiculosSeguros) => {
        if (vehiculosSeguros && Array.isArray(vehiculosSeguros)) {
            return vehiculosSeguros.map((seguro, index) => (
                <div key={index} className="resultado-card-seguro">
                    <h4>Seguro Vehicular:</h4>
                    <p><strong>N° Póliza:   </strong> {seguro.n_poliza}</p>
                    <p><strong>Estado de vencimiento:   </strong> {seguro.estado_vencimiento}</p>
                    <p><strong>Fecha de vigencia hasta:  </strong>   {seguro.fecha_vigencia_hasta}</p>
                </div>
            ));
        } else {
            return <p>No hay vehículos seguros disponibles.</p>;
        }
    };

    // Función para renderizar los propietarios
    const renderPropietarios = (propietarios) => {
        if (propietarios) {
            return (
                <div className="resultado-card-propietarios">
                    <h4>Propietarios:</h4>
                    {/* Aquí se muestran los propietarios uno debajo del otro */}
                    {Object.keys(propietarios).map((key) => {
                        const propietario = propietarios[key];
                        return (
                            <p key={key}>{`${propietario.nombre} ${propietario.apPaterno} ${propietario.apMaterno}`}</p>
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

            {/* Contenedor de búsqueda por placa y empadronamiento */}
            <div className="busqueda-container">
                {/* Sección de búsqueda por placa */}
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
                        <button className="busqueda-placa-button" onClick={handleSearchPlaca}>Buscar</button>
                    </div>
                </div>

                {/* Sección de búsqueda por empadronamiento */}
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
                        <button className="busqueda-empadronamiento-button" onClick={handleSearchEmpadronamiento}>Buscar</button>
                    </div>
                </div>
            </div>

            {/* Mostrar resultados de placa */}
            {resultadosPlaca && resultadosPlaca.vehiculo && (
                <div className="resultado-card">
                    <div className="resultado-card-info">
                        <h3>Detalles del Vehículo</h3>
                        <p><strong>N° Empadronamiento:  </strong> {resultadosPlaca.empadronamiento?.n_empadronamiento || 'No disponible'}</p>
                        <p><strong>N° Placa:    </strong> {resultadosPlaca.vehiculo?.placa || 'No disponible'}</p>
                        <p><strong>Marca:   </strong> {resultadosPlaca.vehiculo?.marca || 'No disponible'}</p>
                        <p><strong>N° Tarjeta:  </strong> {resultadosPlaca.vehiculo?.n_tarjeta || 'No disponible'}</p>
                        <p><strong>Asociación:  </strong> {resultadosPlaca.asociacion || 'No disponible'}</p>
                        <p><strong>N° TUC:  </strong> {resultadosPlaca.numeroTuc || 'No disponible'}</p>
                        <p><strong>Estado de Tuc:   </strong> {resultadosPlaca.estadoVigenciaTuc || 'No disponible'}</p>
                    </div>

                    {/* Imagen del vehículo */}
                    <img className="resultado-card-image" src={resultadosPlaca.vehiculo?.imagen_url || ''} alt={resultadosPlaca.vehiculo?.marca || 'Imagen no disponible'} />

                    {/* Renderización de seguros (ahora en la sección de propietarios) */}
                    {renderSeguros(resultadosPlaca.vehiculosSeguros)}

                    {/* Renderización de Propietarios (ahora en la sección de imagen) */}
                    {renderPropietarios(resultadosPlaca.propietarios)}


                </div>
            )}

            {/* Mostrar resultados de empadronamiento */}
            {resultadosEmpadronamiento && resultadosEmpadronamiento.vehiculo && (
                <div className="resultado-card">
                    <div className="resultado-card-info">
                        <h3>Detalles del Vehículo</h3>
                        <p><strong>N° Empadronamiento:  </strong> {resultadosEmpadronamiento.n_empadronamiento || 'No disponible'}</p>
                        <p><strong>Placa:   </strong> {resultadosEmpadronamiento.vehiculo?.placa || 'No disponible'}</p>
                        <p><strong>Marca:   </strong> {resultadosEmpadronamiento.vehiculo?.marca || 'No disponible'}</p>
                        <p><strong>N° Tarjeta:  </strong> {resultadosEmpadronamiento.vehiculo?.n_tarjeta || 'No disponible'}</p>
                        <p><strong>Asociación:  </strong> {resultadosEmpadronamiento.asociacion || 'No disponible'}</p>
                        <p><strong>N° TUC:  </strong> {resultadosEmpadronamiento.numeroTuc || 'No disponible'}</p>
                        <p><strong>Estado de TUC:   </strong> {resultadosEmpadronamiento.estadoVigenciaTuc || 'No disponible'}</p>
                    </div>
                    {/* Imagen del vehículo */}
                    <img className="resultado-card-image" src={resultadosEmpadronamiento.vehiculo?.imagen_url || ''} alt={resultadosEmpadronamiento.vehiculo?.marca || 'Imagen no disponible'} />


                    {/* Renderización de seguros (ahora en la sección de propietarios) */}
                    {renderSeguros(resultadosEmpadronamiento.vehiculosSeguros)}

                    {/* Renderización de Propietarios (ahora en la sección de imagen) */}
                    {renderPropietarios(resultadosEmpadronamiento.propietarios)}
                </div>
            )}
            {/* Botón para limpiar las búsquedas */}
            <div className="inicio-clear-button-container">
                <button className="inicio-clear-button" onClick={handleClear}>Limpiar Búsqueda</button>
            </div>
        </div>
    );
}

export default Inicio;
