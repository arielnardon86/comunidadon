import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Schedule from "./Schedule";
import ClubInfo from "./ClubInfo";
import { API_BASE_URL } from "../config"; // Importamos API_BASE_URL

function Dashboard({
  token,
  username,
  reservations,
  setReservations,
  setToken,
  handleLogout,
  building,
}) {
  console.log("Building recibido como prop en Dashboard:", building);
  console.log("Token recibido en Dashboard:", token);
  const [selectedBuilding, setSelectedBuilding] = useState(building);
  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(true);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    console.log("selectedBuilding en useEffect:", selectedBuilding);
    console.log("token en useEffect:", token);

    const fetchTables = async () => {
      setLoadingTables(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/${selectedBuilding}/api/tables`, // Usamos API_BASE_URL
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error(`Error fetching tables: ${response.status} - ${await response.text()}`);
        }
        const data = await response.json();
        setTables(data);
        console.log("Tables cargadas:", data);
      } catch (error) {
        console.error("Error fetching tables:", error);
        setError(error.message);
        setTables([]);
      } finally {
        setLoadingTables(false);
      }
    };

    const fetchReservations = async () => {
      setLoadingReservations(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/${selectedBuilding}/api/reservations`, // Usamos API_BASE_URL
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error(`Error fetching reservations: ${response.status} - ${await response.text()}`);
        }
        const data = await response.json();
        setReservations(data);
        console.log("Reservations cargadas:", data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setReservations([]);
      } finally {
        setLoadingReservations(false);
      }
    };

    if (selectedBuilding && token) {
      fetchTables();
      fetchReservations();
    } else {
      console.warn("selectedBuilding o token no definidos:", { selectedBuilding, token });
      setError("Token o edificio no definidos");
    }
  }, [selectedBuilding, token, setReservations]);

  if (!token) {
    return <Navigate to={`/${selectedBuilding}/login`} />;
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="content">
          <h1>Error</h1>
          <p>{error}</p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="content">
        <h1>Reservas - {selectedBuilding.replace('-', ' ').toUpperCase()}</h1>
        {loadingTables || loadingReservations ? (
          <p>Cargando datos...</p>
        ) : (
          <>
            <Schedule
              tables={tables}
              reservations={reservations}
              setReservations={setReservations}
              token={token}
              username={username}
              selectedBuilding={selectedBuilding}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
            <ClubInfo building={selectedBuilding} token={token} />
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;