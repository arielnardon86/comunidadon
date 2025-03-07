import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Schedule from "./components/Schedule";
import ClubInfo from "./ClubInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";
import Login from "./Login.jsx";
import Register from "./components/Register";
import { jwtDecode } from "jwt-decode";

function App() {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState(""); // Estado para el username

  const apiUrl = import.meta.env.VITE_API_URL || "https://comunidadon-backend.onrender.com";

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken); // Decodificar con jwt-decode
        console.log("Decoded token:", decoded); // Log para depuración
        setUsername(decoded.username || ""); // Asegurar que username esté definido
      } catch (error) {
        console.error("Error decoding token:", error);
        setUsername("");
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const headers = { Authorization: `Bearer ${token}` };

          const tablesRes = await fetch(`${apiUrl}/api/tables`, { headers });
          if (!tablesRes.ok) {
            throw new Error(`Error ${tablesRes.status}: No se pudo obtener las mesas`);
          }
          const tablesData = await tablesRes.json();
          setTables(Array.isArray(tablesData) ? tablesData : []);

          const reservationsRes = await fetch(`${apiUrl}/api/reservations`, { headers });
          if (!reservationsRes.ok) {
            throw new Error(`Error ${reservationsRes.status}: No se pudieron obtener las reservas`);
          }
          const reservationsData = await reservationsRes.json();
          setReservations(Array.isArray(reservationsData) ? reservationsData : []);
        } catch (error) {
          console.error("Error fetching data:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al obtener los datos del servidor.",
          });
        }
      };

      fetchData();
    }
  }, [token, apiUrl]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsername("");
  };

  if (!token) {
    return (
      <div className="p-4">
        {showRegister ? (
          <Register setToken={setToken} setShowRegister={setShowRegister} />
        ) : (
          <Login setToken={setToken} setShowRegister={setShowRegister} />
        )}
        <button onClick={() => setShowRegister(!showRegister)}>
          {showRegister ? "Volver a Iniciar Sesión" : "Registrarse"}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button onClick={handleLogout}>Cerrar Sesión</button>
      <h1>Edificio Vow</h1>
      <p>
        <FontAwesomeIcon icon={faMapPin} />
          Libertad 231 - Villa Carlos Paz
      </p>
      <Schedule
        tables={tables}
        reservations={reservations}
        setReservations={setReservations}
        token={token}
        username={username} // Pasar el username al componente Schedule
      />
      <div style={{ maxWidth: "600px", margin: "20px auto" }}>
        <ClubInfo />
      </div>
    </div>
  );
}

export default App;