import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Schedule from "./components/Schedule.jsx";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [username, setUsername] = useState(null);
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL || "https://comunidadon-backend.onrender.com";

  useEffect(() => {
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUsername(decoded.username);
    } else {
      setUsername(null);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const building = decoded.building;
      const fetchTables = async () => {
        try {
          const response = await fetch(`${apiUrl}/${building}/api/tables`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) {
            throw new Error("Error al obtener mesas");
          }
          const data = await response.json();
          setTables(data);
        } catch (error) {
          console.error("Error al obtener mesas:", error);
        }
      };

      const fetchReservations = async () => {
        try {
          const response = await fetch(`${apiUrl}/${building}/api/reservations`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) {
            throw new Error("Error al obtener reservas");
          }
          const data = await response.json();
          setReservations(data);
        } catch (error) {
          console.error("Error al obtener reservas:", error);
        }
      };

      fetchTables();
      fetchReservations();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsername(null);
    setTables([]);
    setReservations([]);
  };

  return (
    <Router>
      <div className="p-4">
        {token && (
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">
              Sistema de Reservas - {username === "admin" ? "Admin" : "Usuario"}
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
        <Routes>
          <Route
            path="/"
            element={
              token ? (
                <Navigate to="/vow" replace />
              ) : (
                <Navigate to="/vow/login" replace />
              )
            }
          />
          <Route
            path="/:building/login"
            element={
              !token ? (
                <Login setToken={setToken} />
              ) : (
                <Navigate to={`/${token ? JSON.parse(atob(token.split(".")[1])).building : "vow"}`} replace />
              )
            }
          />
          <Route
            path="/:building"
            element={
              token ? (
                <Schedule
                  tables={tables}
                  reservations={reservations}
                  setReservations={setReservations}
                  token={token}
                  username={username}
                />
              ) : (
                <Navigate to={`/${token ? JSON.parse(atob(token.split(".")[1])).building : "vow"}/login`} replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;