import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Schedule from "./Schedule";
import ClubInfo from "./ClubInfo";
import { API_BASE_URL } from "../config";

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
  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(true);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    console.log("Building en useEffect:", building);
    console.log("Token en useEffect:", token);

    const fetchTables = async () => {
      setLoadingTables(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/${building}/api/tables`,
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
          `${API_BASE_URL}/${building}/api/reservations`,
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

    if (building && token) {
      fetchTables();
      fetchReservations();
    } else {
      console.warn("Building o token no definidos:", { building, token });
      setError("Token o edificio no definidos");
    }
  }, [building, token, setReservations]);

  if (!token) {
    return <Navigate to={`/${building}/login`} />;
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
        <h1>Reservas - {building.replace("-", " ").toUpperCase()}</h1>
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
              selectedBuilding={building} // Usamos el prop building
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
            <ClubInfo building={building} token={token} />
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;