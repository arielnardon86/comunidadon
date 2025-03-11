import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Schedule from "./Schedule";
import ClubInfo from "./ClubInfo";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

function Dashboard({ token, username, tables, reservations, setReservations }) {
  const { building } = useParams();
  const [localTables, setLocalTables] = useState(tables);
  const [localReservations, setLocalReservations] = useState(reservations);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchTables();
      fetchReservations();
    }
  }, [token, building]);

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
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(`/${building}/login`);
  };

  return (
    <div className="container mx-auto p-4 relative">
      {/* Botón de cerrar sesión en la esquina superior derecha */}
      <div className="absolute top-0 right-0 mt-4 mr-4 sm:mr-2 sm:mt-2">
  <button
    onClick={handleLogout}
    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm sm:text-base"
  >
    Cerrar Sesión
  </button>
</div>

      {/* Título y contenido principal */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Realiza tu reserva</h2>
        <Schedule
          tables={localTables}
          reservations={localReservations}
          setReservations={setReservations}
          token={token}
          username={username}
        />
        <div className="mt-8">
          <ClubInfo token={token} username={username} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;