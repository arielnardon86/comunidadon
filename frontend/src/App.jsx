import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Login from "./Login";
import Home from "./Home";
import Footer from "./components/Footer";
import Swal from "sweetalert2";
import "./App.css";
import { API_BASE_URL } from "./config";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [reservations, setReservations] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [isLoadingBuildings, setIsLoadingBuildings] = useState(true);

  useEffect(() => {
    const fetchBuildings = async () => {
      if (!token) {
        setIsLoadingBuildings(false);
        return; // No intenta cargar edificios si no hay token
      }

      try {
        setIsLoadingBuildings(true);
        const response = await fetch(`${API_BASE_URL}/api/buildings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${await response.text()}`);
        }
        const data = await response.json();
        setBuildings(data);
      } catch (error) {
        console.error("Error al obtener los edificios:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los edificios. Por favor, inicia sesión nuevamente.",
        });
        handleLogout(); // Cierra sesión si falla la carga de edificios
      } finally {
        setIsLoadingBuildings(false);
      }
    };

    fetchBuildings();
  }, [token]);

  useEffect(() => {
    if (!token) {
      setUsername("");
      setBuildings([]); // Limpia los edificios si no hay token
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    }
  }, [token]);

  const handleLogin = (newToken, newUsername) => {
    setToken(newToken);
    setUsername(newUsername);
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
  };

  const handleLogout = () => {
    setToken("");
    setUsername("");
    setReservations([]);
    setBuildings([]);
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
        {isLoadingBuildings ? (
          <Route path="*" element={<p>Cargando edificios...</p>} />
        ) : buildings.length > 0 ? (
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
          <Route
            path="*"
            element={
              <p>
                No se encontraron edificios. Por favor, inicia sesión o contacta
                al administrador.
              </p>
            }
          />
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;