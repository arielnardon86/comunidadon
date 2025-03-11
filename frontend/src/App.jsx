import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./components/Dashboard";
import './App.css';
import Swal from "sweetalert2"; // Asegúrate de importar Swal si no está instalado

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [username, setUsername] = useState("");
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setUsername(decodedToken.username);
      } catch (error) {
        console.error("Error decoding token:", error);
        setToken(null);
        localStorage.removeItem("token");
      }
    } else {
      setUsername("");
    }
  }, [token]);

  // Función para cerrar sesión con mensaje de despedida
  const handleLogout = () => {
    Swal.fire({
      icon: "success",
      title: "Sesión cerrada",
      text: "¡Hasta pronto!",
      timer: 1500, // Muestra el mensaje durante 1.5 segundos
      showConfirmButton: false, // Sin botón de confirmación
    }).then(() => {
      localStorage.removeItem("token");
      setToken(null);
      setUsername("");
    });
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
              setToken={setToken}
              handleLogout={handleLogout}
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