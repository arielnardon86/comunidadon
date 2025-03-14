// frontend/src/Home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Select from "react-select"; // Importamos react-select
import "./Home.css"; // Seguiremos usando estilos personalizados

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

  return (
    <div className="home-container">
      <Header /> {/* Reutilizamos el Header */}
      <div className="content">
        <h1>Bienvenido a ComunidadOn</h1>
        <p>Selecciona un edificio para continuar:</p>
        <Select
          value={selectedBuilding}
          onChange={handleBuildingChange}
          options={buildingOptions}
          placeholder="-- Selecciona un edificio --"
          className="building-select"
          styles={customStyles} // Estilos personalizados
          isSearchable={false} // Opcional: Deshabilita la búsqueda si no es necesario
        />
      </div>
    </div>
  );
}

// Estilos personalizados para react-select
const customStyles = {
  control: (provided) => ({
    ...provided,
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#007bff",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#333",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#666",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "5px",
    marginTop: "2px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#007bff" : "white",
    color: state.isSelected ? "white" : "#333",
    "&:hover": {
      backgroundColor: "#e6f0fa",
      color: "#333",
    },
  }),
};

export default Home;