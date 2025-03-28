// frontend/src/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { FaBuilding } from "react-icons/fa";
import { API_BASE_URL } from "./config"; // Importamos API_BASE_URL
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [buildingOptions, setBuildingOptions] = useState([]); // Estado para las opciones dinámicas

  // Obtener la lista de edificios desde el backend al montar el componente
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/buildings`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const buildings = await response.json();
        console.log("Edificios obtenidos del backend:", buildings);

        // Transformar la lista de edificios al formato de react-select
        const options = buildings.map((building) => ({
          value: building,
          label: building
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        }));
        setBuildingOptions(options);
      } catch (error) {
        console.error("Error al obtener los edificios:", error);
        // Fallback en caso de error
        setBuildingOptions([
          { value: "vow", label: "VOW" },
          { value: "torre-x", label: "Torre X" },
          { value: "miraflores-i", label: "Miraflores I" },
        ]);
      }
    };

    fetchBuildings();
  }, []);

  // Manejar la selección del edificio
  const handleBuildingChange = (selectedOption) => {
    setSelectedBuilding(selectedOption);
    if (selectedOption) {
      navigate(`/${selectedOption.value}`);
    }
  };

  // Estilo para el ícono personalizado
  const formatOptionLabel = ({ label }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <FaBuilding style={{ marginRight: "8px", color: "#007bff" }} />
      {label}
    </div>
  );

  return (
    <div className="banner">
      <div className="banner-overlay">
        <div className="home-container">
          <img src="/header-home.png" alt="Logo" className="header-logo-home" />
          <div className="content">
            <h1>Reservá tu lugar al instante</h1>
            <p>Ponemos la tecnología al servicio de la comunidad</p>
            <div className="selector-container">
              <Select
                value={selectedBuilding}
                onChange={handleBuildingChange}
                options={buildingOptions}
                placeholder="-- Selecciona un edificio --"
                className="building-select"
                styles={customStyles}
                formatOptionLabel={formatOptionLabel}
                isSearchable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Estilos personalizados para react-select
const customStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "40px",
    padding: "8px",
    borderRadius: "20px",
    border: "2px solid #3272b2",
    backgroundColor: "#fff",
    boxShadow: "none",
    transition: "all 0.3s ease",
    "&:hover": {
      borderColor: "#3272b2",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#333",
    fontWeight: "500",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#6c757d",
    fontStyle: "italic",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "8px",
    marginTop: "4px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 10000,
    position: "absolute",
    width: "100%",
    maxHeight: "200px",
    overflowY: "auto",
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "200px",
    overflowY: "auto",
  }),
  option: (provided, state) => ({
    ...provided,
    padding: "10px 12px",
    backgroundColor: state.isSelected
      ? "#007bff"
      : state.isFocused
      ? "#e6f0fa"
      : "white",
    color: state.isSelected ? "white" : "#333",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: state.isSelected ? "#0056b3" : "#e6f0fa",
    },
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#4CAF50",
    "&:hover": {
      color: "#45a049",
    },
  }),
};

export default Home;