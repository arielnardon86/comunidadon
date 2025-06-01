import { useState, useEffect } from "react";
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

// Mapeo de nombres de íconos a los íconos de FontAwesome
const iconMap = {
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
};

// Información estática de los edificios
const clubInfoData = {
  "Vow": {
    textColor: "#718096",
    regulation: {
      rules: [
        "No se permite el ingreso de mascotas.",
        "El uso del SUM debe reservarse con 48 horas de anticipación.",
        "Prohibido fumar dentro del club."
      ],
    },
    horarios: {
      mediodia: "12:00 - 15:00",
      noche: ["20:00 - 23:00"],
    },
    servicios: [
      { icon: "faWifi", text: "WiFi gratis" },
      { icon: "faBanSmoking", text: "Prohibido fumar" },
      { icon: "faParking", text: "Estacionamiento disponible" },
      { icon: "faUtensils", text: "Cocina equipada" },
    ],
  },
  "torre-del-lago": {
    textColor: "#2d3748",
    regulation: {
      rules: [
        "Capacidad máxima de 30 personas.",
        "Limpieza a cargo del usuario después del evento.",
        "No se permiten bebidas alcohólicas después de las 22:00."
      ],
    },
    horarios: {
      mediodia: "11:00 - 14:00",
      noche: ["19:00 - 22:00"],
    },
    servicios: [
      { icon: "faMedkit", text: "Botiquín de primeros auxilios" },
      { icon: "faToilet", text: "Baños disponibles" },
      { icon: "faBirthdayCake", text: "Ideal para cumpleaños" },
      { icon: "faTv", text: "Televisor disponible" },
    ],
  },
  // Puedes agregar más edificios aquí
};

// Configuración por defecto en caso de que el edificio no sea válido
const defaultInfo = {
  title: "Información del Club",
  backgroundImage: null,
  textColor: "#718096",
  regulation: {
    rules: ["Reglamento no disponible", "Contacta al administrador"],
  },
  horarios: {
    mediodia: "No disponible",
    noche: ["No disponible"],
  },
  servicios: [],
};

function ClubInfo({ token, building }) {
  const [regulationExpanded, setRegulationExpanded] = useState(false);
  const [horariosExpanded, setHorariosExpanded] = useState(false);
  const [serviciosExpanded, setServiciosExpanded] = useState(false);
  const [info, setInfo] = useState(defaultInfo);

  useEffect(() => {
    // Actualizar la información basada en la prop 'building'
    console.log("Building recibido:", building);
    if (building && clubInfoData[building]) {
      setInfo(clubInfoData[building]);
    } else {
      setInfo(defaultInfo);
    }
  }, [building]);

  const toggleRegulation = () => setRegulationExpanded(!regulationExpanded);
  const toggleHorarios = () => setHorariosExpanded(!horariosExpanded);
  const toggleServicios = () => setServiciosExpanded(!serviciosExpanded);

  return (
    <div className="clubinfo-container">
      {/* Contenedor de información */}
      <div
        className="info-container"
        style={{
          backgroundImage: info.backgroundImage ? `url(${info.backgroundImage})` : "none",
          backgroundColor: info.backgroundImage ? "transparent" : "#f7fafc",
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
              <h2>Horarios</h2>
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
              <h2>Servicios</h2>
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
                        <FontAwesomeIcon icon={iconMap[service.icon]} /> {service.text}
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
    </div>
  );
}

export default ClubInfo;