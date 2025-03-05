import React, { useState } from 'react';
import './ClubInfo.css'; // Importa tus estilos CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faBanSmoking, faParking, faMedkit, faToilet, faBirthdayCake, faUtensils, faTv, faGlassCheers, faHome } from '@fortawesome/free-solid-svg-icons';

function ClubInfo() {
  const [regulationExpanded, setregulationExpanded] = useState(false);
  const [horariosExpanded, setHorariosExpanded] = useState(false);
  const [serviciosExpanded, setServiciosExpanded] = useState(false);

  const toggleRegulation = () => setregulationExpanded(!regulationExpanded);
  const toggleHorarios = () => setHorariosExpanded(!horariosExpanded);
  const toggleServicios = () => setServiciosExpanded(!serviciosExpanded);

  return (
    <div>
      <div className={`section ${regulationExpanded ? 'expanded' : ''}`}>
        <div className="section-header" onClick={toggleRegulation}>
          <h2>Reglamento</h2>
          <button className="expand-button">{regulationExpanded ? '-' : '+'}</button>
        </div>
        <div className="section-content">
          <p>Respetar los horarios establecidos</p>
          <p>No hacer ruidos molestos</p>
        </div>
      </div>

      <div className={`section ${horariosExpanded ? 'expanded' : ''}`}>
        <div className="section-header" onClick={toggleHorarios}>
          <h2>Horarios del SUM</h2>
          <button className="expand-button">{horariosExpanded ? '-' : '+'}</button>
        </div>
        <div className="section-content">
          <h2>Mediodía</h2>
          <p>Todos los días: 12:00 a 16:00</p>
          <h2>Noche</h2>
          <p>Domingo a Jueves: 20:00 a 01:00</p>
          <p>Viernes y Sábados: 20:00 a 02:00</p>
        </div>
      </div>

      <div className={`section ${serviciosExpanded ? 'expanded' : ''}`}>
        <div className="section-header" onClick={toggleServicios}>
          <h2>Servicios del SUM</h2>
          <button className="expand-button">{serviciosExpanded ? '-' : '+'}</button>
        </div>
        <div className="section-content">
          <ul className="services-list">
            <li><FontAwesomeIcon icon={faWifi} />&nbsp; Wifi</li>
            <li><FontAwesomeIcon icon={faTv} />&nbsp; TV</li>
            <li><FontAwesomeIcon icon={faToilet} />&nbsp; Baños</li>
            <li><FontAwesomeIcon icon={faParking} />&nbsp; Estacionamiento</li>
            <li><FontAwesomeIcon icon={faMedkit} />&nbsp; Seguro Médico</li>
            <li><FontAwesomeIcon icon={faBanSmoking} />&nbsp; Prohibido fumar</li>
            <li><FontAwesomeIcon icon={faBirthdayCake} />&nbsp; Cumpleaños</li>
            <li><FontAwesomeIcon icon={faUtensils} />&nbsp; Parrilla</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ClubInfo;