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
import { API_BASE_URL } from "../config"; // Importamos API_BASE_URL

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

// Configuración por defecto en caso de que el backend falle
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

  console.log("Building recibido como prop:", building);
  console.log("Token recibido:", token);

  useEffect(() => {
    const fetchClubInfo = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/${building}/api/club-info`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Respuesta del backend /api/club-info:", response);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Datos del backend:", data);
        setInfo(data);
      } catch (error) {
        console.error("Error fetching club info:", error);
        setInfo(defaultInfo);
      }
    };

    if (token && building) {
      fetchClubInfo();
    } else {
      console.warn("No se ejecutó fetchClubInfo porque token o building no están definidos");
      setInfo(defaultInfo);
    }
  }, [building, token]);

  const toggleRegulation = () => setRegulationExpanded(!regulationExpanded);
  const toggleHorarios = () => setHorariosExpanded(!horariosExpanded);
  const toggleServicios = () => setServiciosExpanded(!serviciosExpanded);

  return (
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
  );
}

export default ClubInfo;