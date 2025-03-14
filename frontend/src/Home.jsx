// frontend/src/Home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Select from "react-select";
import { FaBuilding } from "react-icons/fa"; // Importamos el ícono de edificio
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  // Opciones para el desplegable
  const buildingOptions = [
    { value: "vow", label: "VOW" },
    { value: "torre-x", label: "Torre X" },
  ];

  // Manejar la selección del edificio
  const handleBuildingChange = (selectedOption) => {
    setSelectedBuilding(selectedOption);
    if (selectedOption) {
      navigate(`/${selectedOption.value}`); // Redirige al edificio seleccionado
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
      <Header />
      <div className="content">
        <h1>Bienvenido a ComunidadOn</h1>
        <p>Selecciona un edificio para continuar:</p>
        <Select
          value={selectedBuilding}
          onChange={handleBuildingChange}
          options={buildingOptions}
          placeholder="-- Selecciona un edificio --"
          className="building-select"
          styles={customStyles}
          formatOptionLabel={formatOptionLabel} // Añadimos el ícono a las opciones
          isSearchable={false}
        />
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
    borderRadius: "8px", // Bordes más suaves
    border: "1px solid #d1d3e2",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)", // Sombra sutil
    transition: "all 0.3s ease", // Transición suave
    "&:hover": {
      borderColor: "#007bff",
      boxShadow: "0 4px 8px rgba(0, 123, 255, 0.1)", // Sombra más pronunciada al pasar el mouse
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#333",
    fontWeight: "500", // Texto un poco más bold
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#6c757d", // Color gris suave para el placeholder
    fontStyle: "italic",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "8px",
    marginTop: "4px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra en el menú desplegable
  }),
  option: (provided, state) => ({
    ...provided,
    padding: "10px 12px",
    backgroundColor: state.isSelected
      ? "#007bff"
      : state.isFocused
      ? "#e6f0fa" // Fondo suave al pasar el mouse
      : "white",
    color: state.isSelected ? "white" : "#333",
    cursor: "pointer",
    transition: "background-color 0.2s ease", // Transición suave para el hover
    "&:hover": {
      backgroundColor: state.isSelected ? "#0056b3" : "#e6f0fa",
    },
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#007bff",
    "&:hover": {
      color: "#0056b3",
    },
  }),
};

export default Home;