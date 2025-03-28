import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Login from "./Login";
import Home from "./Home";
import Footer from "./components/Footer";
import "./App.css";
import { API_BASE_URL } from "./config"; // Importa API_BASE_URL

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [reservations, setReservations] = useState([]);
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/buildings`); // Usa API_BASE_URL
        if (!response.ok) {
          throw new Error("Error al obtener los edificios");
        }
        const data = await response.json();
        setBuildings(data);
      } catch (error) {
        console.error("Error al obtener los edificios:", error);
      }
    };

    fetchBuildings();
  }, []);

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
        <Route path="/" element={<Home />} />
        <Route
          path="/:building/login"
          element={<Login setToken={setToken} setUsername={setUsername} />}
        />
        {buildings.length > 0 ? (
          buildings.map((building) => (
            <Route
              key={building}
              path={`/${building}`}
              element={
                token ? (
                  <>
                    <Header
                      username={username}
                      handleLogout={handleLogout}
                      building={building}
                    />
                    <Dashboard
                      token={token}
                      username={username}
                      reservations={reservations}
                      setReservations={setReservations}
                      setToken={setToken}
                      handleLogout={handleLogout}
                      building={building}
                    />
                  </>
                ) : (
                  <Navigate to={`/${building}/login`} />
                )
              }
            />
          ))
        ) : (
          <Route path="*" element={<p>Cargando edificios...</p>} />
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;