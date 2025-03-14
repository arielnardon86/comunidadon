import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import "./App.css"; // Reutilizamos los estilos de App.css

function Home() {
  const navigate = useNavigate();
  const [selectedBuilding, setSelectedBuilding] = useState("");

  // Lista de edificios activos
  const buildings = [
    { value: "", label: "Selecciona un edificio" }, // Opción por defecto
    { value: "vow", label: "VOW" },
    { value: "torre-x", label: "Torre X" },
  ];

  const handleBuildingChange = (e) => {
    const building = e.target.value;
    setSelectedBuilding(building);
    if (building) {
      navigate(`/${building}`); // Redirige al edificio seleccionado
    }
  };

  return (
    <div className="App">
      <Header /> {/* Header sin usuario ni logout, ya que no hay sesión */}
      <div className="home-container">
        <h1>Bienvenido a CommunityOn</h1>
        <p>Selecciona un edificio para gestionar tus reservas:</p>
        <select
          value={selectedBuilding}
          onChange={handleBuildingChange}
          className="building-select"
        >
          {buildings.map((building) => (
            <option key={building.value} value={building.value}>
              {building.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Home;