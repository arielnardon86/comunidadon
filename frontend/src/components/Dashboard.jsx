import React, { useState, useEffect } from "react";
import Schedule from "./Schedule";
import ClubInfo from "./ClubInfo"; // Importar el nuevo componente

function Dashboard({
  token,
  username,
  reservations,
  setReservations,
  setToken,
  handleLogout,
}) {
  const [selectedBuilding, setSelectedBuilding] = useState("vow");
  const [tables, setTables] = useState([]); // Definir estado local para tables

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch(
          `https://comunidadon-backend.onrender.com/${selectedBuilding}/api/tables`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Error fetching tables");
        const data = await response.json();
        setTables(data); // Usar setTables definido localmente
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    const fetchReservations = async () => {
      try {
        const response = await fetch(
          `https://comunidadon-backend.onrender.com/${selectedBuilding}/api/reservations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Error fetching reservations");
        const data = await response.json();
        setReservations(data); // Usar setReservations recibido como prop
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchTables();
    fetchReservations();
  }, [selectedBuilding, token, setReservations]);

  return (
    <div className="dashboard-container">
      <div className="content">
        <h1>Reservas - {selectedBuilding.toUpperCase()}</h1>
        <Schedule
          tables={tables}
          reservations={reservations}
          setReservations={setReservations}
          token={token}
          username={username}
          selectedDate={new Date().toISOString().split("T")[0]} // Fecha por defecto
          setSelectedDate={(date) => console.log("Date changed:", date)} // Placeholder
        />
        <ClubInfo building={selectedBuilding} /> {/* Mover ClubInfo aquí debajo */}
      </div>
    </div>
  );
}

export default Dashboard;