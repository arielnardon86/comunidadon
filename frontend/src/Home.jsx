// frontend/src/Home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Select from "react-select";
import { FaBuilding } from "react-icons/fa";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  // Opciones para el desplegable (añadí más opciones para simular muchos edificios)
  const buildingOptions = [
    { value: "vow", label: "VOW" },
    { value: "torre-x", label: "Torre X" },
  ];

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
    <div className="home-container">
      <img src="/header-home.png" alt="Logo" className="header-logo-home" />
      <div className="banner">
        <div className="banner-overlay">
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
    zIndex: 10000, /* Alto z-index para superponerse */
    position: "absolute", /* Posicionamiento absoluto */
    width: "100%", /* Ancho completo del control */
    maxHeight: "200px", /* Altura máxima antes de permitir desplazamiento */
    overflowY: "auto", /* Desplazamiento vertical */
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "200px", /* Altura máxima del menú */
    overflowY: "auto", /* Desplazamiento si hay muchas opciones */
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