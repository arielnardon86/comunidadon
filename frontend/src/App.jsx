import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Schedule from "./components/Schedule";
import ClubInfo from "./ClubInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";
import Login from "./Login.jsx";

function App() {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedTurn, setSelectedTurn] = useState("");
  const [date, setDate] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Define la URL base usando una variable de entorno
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3001";

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
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
  }, [token, apiUrl]); // Agrega apiUrl como dependencia

  const handleReserve = async () => {
    if (!selectedTable || !selectedTurn || !date) {
      Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Todos los campos son obligatorios",
      });
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tableId: Number(selectedTable),
          turno: selectedTurn,
          date,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo realizar la reserva`);
      }

      const data = await response.json();
      setReservations((prevReservations) => [...prevReservations, data]);

      Swal.fire({
        icon: "success",
        title: "Reserva realizada",
        text: "Tu reserva se ha realizado con éxito",
      });

      setSelectedTable("");
      setSelectedTurn("");
      setDate("");
    } catch (error) {
      console.error("Error al reservar:", error);
      Swal.fire({
        icon: "error",
        title: "Error en el servidor",
        text: error.message,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (!token) {
    return <Login setToken={setToken} />;
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
        tables={tables} // Pasa las mesas como prop
        reservations={reservations}
        setReservations={setReservations}
        token={token}
      />
      <div style={{ maxWidth: "600px", margin: "20px auto" }}>
        <ClubInfo />
      </div>
    </div>
  );
}

export default App;