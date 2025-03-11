import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./components/Dashboard";
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [username, setUsername] = useState("");
  const [tables, setTables] = useState([]); // Añadir estado para tables
  const [reservations, setReservations] = useState([]); // Añadir estado para reservations

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setUsername(decodedToken.username);
      } catch (error) {
        console.error("Error decoding token:", error);
        setToken(null); // Limpiar token si es inválido
        localStorage.removeItem("token");
      }
    } else {
      setUsername("");
    }
  }, [token]);

  // Función para cerrar sesión desde App.jsx
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsername("");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? <Navigate to="/vow" replace /> : <Navigate to="/vow/login" replace />
        }
      />
      <Route
        path="/:building/login"
        element={
          token ? (
            <Navigate to={`/${token ? JSON.parse(atob(token.split(".")[1])).building : "vow"}`} replace />
          ) : (
            <Login setToken={setToken} />
          )
        }
      />
      <Route
        path="/:building"
        element={
          token ? (
            <Dashboard
              token={token}
              username={username}
              tables={tables}
              reservations={reservations}
              setReservations={setReservations}
              setToken={setToken} // Pasar setToken a Dashboard
              handleLogout={handleLogout} // Pasar handleLogout a Dashboard
            />
          ) : (
            <Navigate to={`/${token ? JSON.parse(atob(token.split(".")[1])).building : "vow"}/login`} replace />
          )
        }
      />
    </Routes>
  );
}

export default App;