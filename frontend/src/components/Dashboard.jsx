import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Schedule from "./Schedule";
import ClubInfo from "./ClubInfo";

function Dashboard({ token, username, tables, reservations, setReservations, setToken, handleLogout }) {
  const { building } = useParams();
  const [localTables, setLocalTables] = useState(tables);
  const [localReservations, setLocalReservations] = useState(reservations);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchTables();
      fetchReservations();
    } else {
      navigate(`/${building}/login`, { replace: true });
    }
  }, [token, building, navigate]);

  useEffect(() => {
    setLocalReservations(reservations);
  }, [reservations]);

  const fetchTables = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || "https://comunidadon-backend.onrender.com";
    try {
      const response = await fetch(`${apiUrl}/${building}/api/tables`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error fetching tables");
      const data = await response.json();
      setLocalTables(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchReservations = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || "https://comunidadon-backend.onrender.com";
    try {
      const response = await fetch(`${apiUrl}/${building}/api/reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error fetching reservations");
      const data = await response.json();
      setLocalReservations(data);
      setReservations(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="relative dashboard-container" style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
      <div className="absolute top-0 right-0 mt-4 mr-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar Sesión
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-6">Realiza tu reserva</h2>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Schedule
            key={Date.now()}
            tables={localTables}
            reservations={localReservations}
            setReservations={setLocalReservations}
            token={token}
            username={username}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
        <div style={{ maxWidth: "800px", margin: "0 auto" }} className="mt-4">
          <ClubInfo token={token} username={username} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;