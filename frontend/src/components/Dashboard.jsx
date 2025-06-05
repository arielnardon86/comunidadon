import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Schedule from "./Schedule";
import Modification from "./Modification";
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
  const [showManagement, setShowManagement] = useState(false);

  // Función para decodificar el token
  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error al decodificar el token en Dashboard:", error);
      return null;
    }
  };

  const decodedToken = decodeToken(token);
  const isAdmin = decodedToken?.username === "admin";
  console.log("isAdmin en Dashboard:", isAdmin);

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
      <div className="content" style={{ marginTop: "20px", textAlign: "left", width: "100%" }}>
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
              selectedBuilding={building}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
            {isAdmin && (
              <div className="mt-16 max-w-md mx-auto">
                <button
                  onClick={() => setShowManagement(!showManagement)}
                  className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition-colors duration-200"
                  style={{ backgroundColor: "#3b82f6", color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.375rem" }}
                >
                  {showManagement ? "Ocultar Gestión de Usuarios" : "Gestionar Usuarios"}
                </button>
                {showManagement && (
                  <div className="mt-6 mb-8">
                    <Modification token={token} building={building} />
                  </div>
                )}
              </div>
            )}
            <ClubInfo building={building} token={token} />
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;