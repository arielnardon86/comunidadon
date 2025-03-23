// src/App.jsx
import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Login from "./Login";
import Home from "./Home";
import Footer from "./components/Footer"; // Importa el Footer
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [reservations, setReservations] = useState([]);

  const handleLogin = (newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername);
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
  };

  useEffect(() => {
    if (!token) {
      setUsername("");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    }
  }, [token]);

  const handleLogout = () => {
    setToken("");
    setUsername("");
    setReservations([]);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  return (
    <div className="app-container">
      <Routes>
        {/* Ruta pública: Página principal */}
        <Route path="/" element={<Home />} />

        {/* Rutas públicas: Login */}
        <Route
          path="/:building/login"
          element={<Login setToken={setToken} setUsername={setUsername} />}
        />

        {/* Rutas protegidas */}
        <Route
          path="/vow"
          element={
            token ? (
              <>
                <Header username={username} handleLogout={handleLogout} building="vow" />
                <Dashboard
                  token={token}
                  username={username}
                  reservations={reservations}
                  setReservations={setReservations}
                  setToken={setToken}
                  handleLogout={handleLogout}
                  building="vow"
                />
              </>
            ) : (
              <Navigate to="/vow/login" />
            )
          }
        />
        <Route
          path="/torre-x"
          element={
            token ? (
              <>
                <Header username={username} handleLogout={handleLogout} building="torre-x" />
                <Dashboard
                  token={token}
                  username={username}
                  reservations={reservations}
                  setReservations={setReservations}
                  setToken={setToken}
                  handleLogout={handleLogout}
                  building="torre-x"
                />
              </>
            ) : (
              <Navigate to="/torre-x/login" />
            )
          }
        />

        {/* Redirección para rutas no encontradas */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer /> {/* Añade el Footer aquí para que se muestre en todas las páginas */}
    </div>
  );
}

export default App;