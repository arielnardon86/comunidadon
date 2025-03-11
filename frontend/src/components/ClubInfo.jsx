import { useParams } from "react-router-dom";
import { useState } from "react";
import "../styles/ClubInfo.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWifi,
  faBanSmoking,
  faParking,
  faMedkit,
  faToilet,
  faBirthdayCake,
  faUtensils,
  faTv,
  faGlassCheers,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

// Objeto de configuración por edificio
const buildingInfo = {
  vow: {
    title: "Información del Club Vow",
    backgroundImage: "/src/assets/backgrounds/vow-portada-2.jpg",
    textColor: "#2d3748",
    regulation: {
      rules: ["Respetar los horarios establecidos", "No hacer ruidos molestos", "Mantener el espacio limpio"],
    },
    horarios: {
      mediodia: "Todos los días: 12:00 a 16:00",
      noche: [
        "Domingo a Jueves: 20:00 a 01:00",
        "Viernes y Sábados: 20:00 a 02:00",
      ],
    },
    servicios: [
      { icon: faWifi, text: "Wifi" },
      { icon: faTv, text: "TV" },
      { icon: faToilet, text: "Baños" },
      { icon: faParking, text: "Estacionamiento" },
      { icon: faMedkit, text: "Seguro Médico" },
      { icon: faBanSmoking, text: "Prohibido fumar" },
      { icon: faBirthdayCake, text: "Cumpleaños" },
      { icon: faUtensils, text: "Parrilla" },
    ],
  },
  "edificio-x": {
    title: "Información del Club Edificio X",
    backgroundImage: "/src/assets/backgrounds/edificio-x-portada.jpg",
    textColor: "#4a5568",
    regulation: {
      rules: ["Prohibido traer bebidas alcohólicas", "No se permiten mascotas", "Respetar el aforo máximo"],
    },
    horarios: {
      mediodia: "Lunes a Viernes: 11:00 a 15:00",
      noche: [
        "Domingo a Jueves: 19:00 a 23:00",
        "Viernes y Sábados: 19:00 a 00:00",
      ],
    },
    servicios: [
      { icon: faWifi, text: "Wifi" },
      { icon: faTv, text: "TV" },
      { icon: faToilet, text: "Baños" },
      { icon: faParking, text: "Estacionamiento" },
      { icon: faGlassCheers, text: "Eventos sociales" },
      { icon: faHome, text: "Espacios familiares" },
    ],
  },
  default: {
    title: "Información del Club",
    backgroundImage: "/src/assets/backgrounds/default-portada.jpg",
    textColor: "#718096",
    regulation: {
      rules: ["Reglamento no disponible", "Contacta al administrador"],
    },
    horarios: {
      mediodia: "No disponible",
      noche: ["No disponible"],
    },
    servicios: [],
  },
};

function ClubInfo({ token, username }) {
  const { building } = useParams();
  const [regulationExpanded, setRegulationExpanded] = useState(false);
  const [horariosExpanded, setHorariosExpanded] = useState(false);
  const [serviciosExpanded, setServiciosExpanded] = useState(false);

  const toggleRegulation = () => setRegulationExpanded(!regulationExpanded);
  const toggleHorarios = () => setHorariosExpanded(!horariosExpanded);
  const toggleServicios = () => setServiciosExpanded(!serviciosExpanded);

  const info = buildingInfo[building] || buildingInfo.default;

  return (
    <div
      className="info-container"
      style={{
        backgroundImage: `url(${info.backgroundImage})`,
        color: info.textColor,
      }}
    >
      <div className="info-box">
        {/* Sección Reglamento */}
        <div className={`section ${regulationExpanded ? "expanded" : ""}`}>
          <div className="section-header" onClick={toggleRegulation}>
            <h2>Reglamento</h2>
            <button className="expand-button">
              <span className="arrow">{regulationExpanded ? "↑" : "↓"}</span>
            </button>
          </div>
          {regulationExpanded && (
            <div className="section-content">
              {info.regulation.rules.map((rule, index) => (
                <p key={index}>{rule}</p>
              ))}
            </div>
          )}
        </div>

        {/* Sección Horarios */}
        <div className={`section ${horariosExpanded ? "expanded" : ""}`}>
          <div className="section-header" onClick={toggleHorarios}>
            <h2>Horarios del SUM</h2>
            <button className="expand-button">
              <span className="arrow">{horariosExpanded ? "↑" : "↓"}</span>
            </button>
          </div>
          {horariosExpanded && (
            <div className="section-content">
              <h3>Mediodía</h3>
              <p>{info.horarios.mediodia}</p>
              <h3>Noche</h3>
              {info.horarios.noche.map((schedule, index) => (
                <p key={index}>{schedule}</p>
              ))}
            </div>
          )}
        </div>

        {/* Sección Servicios */}
        <div className={`section ${serviciosExpanded ? "expanded" : ""}`}>
          <div className="section-header" onClick={toggleServicios}>
            <h2>Servicios del SUM</h2>
            <button className="expand-button">
              <span className="arrow">{serviciosExpanded ? "↑" : "↓"}</span>
            </button>
          </div>
          {serviciosExpanded && (
            <div className="section-content">
              {info.servicios.length > 0 ? (
                <ul className="services-list">
                  {info.servicios.map((service, index) => (
                    <li key={index}>
                      <FontAwesomeIcon icon={service.icon} /> {service.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay servicios disponibles para este edificio.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClubInfo;