import { useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faSpinner, faUserPlus } from "@fortawesome/free-solid-svg-icons";

function Schedule({ tables, reservations, setReservations, token, username }) {
  console.log("Props received in Schedule:", { username }); // Log para depuración
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL || "https://comunidadon-backend.onrender.com";

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleReservationClick = async (tableId, turno) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tableId, turno, date: selectedDate }),
      });

      if (!response.ok) {
        let errorMessage = "No se pudo realizar la reserva";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }
        throw new Error(`Error ${response.status}: ${errorMessage}`);
      }

      const reservationsRes = await fetch(`${apiUrl}/api/reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!reservationsRes.ok) {
        throw new Error("Error al recargar reservas");
      }
      const updatedReservations = await reservationsRes.json();
      setReservations(updatedReservations);
      console.log("Reservas actualizadas:", updatedReservations);

      Swal.fire({
        icon: "success",
        title: "Reserva exitosa",
        text: `Has reservado la ${turno} del ${selectedDate}`,
      });
    } catch (error) {
      console.error("Error al reservar:", error);
      const reservationsRes = await fetch(`${apiUrl}/api/reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (reservationsRes.ok) {
        const updatedReservations = await reservationsRes.json();
        setReservations(updatedReservations);
        console.log("Reservas recargadas después de error:", updatedReservations);
        const isAlreadyReserved = updatedReservations.some(
          (res) =>
            res.tableId === tableId &&
            res.turno === turno &&
            res.date === selectedDate
        );
        if (isAlreadyReserved) {
          setReservations([...updatedReservations]);
        }
      } else {
        console.error("Error al recargar reservas después de error:", reservationsRes.status);
      }
      Swal.fire({
        icon: "error",
        title: "Error en el servidor",
        text: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!newUsername || !newPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Username y password son obligatorios",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al registrar usuario");
      }

      const data = await response.json();
      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "¡Nuevo usuario registrado!",
      });
      setNewUsername("");
      setNewPassword("");
    } catch (error) {
      console.error("Error al registrar:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="3x"
            style={{ color: "white" }}
          />
        </div>
      )}

      <h2>Realiza tu reserva</h2>
      <p>
        <FontAwesomeIcon icon={faCircleInfo} /> Seleccioná en el calendario el
        día en el que querés realizar tu reserva y luego seleccioná la mesa y
        el turno haciendo click y listo!
      </p>
      {tables.length === 0 ? (
        <p
          style={{
            color: "#ff4444",
            fontSize: "1.2em",
            fontWeight: "bold",
            animation: "blink 1.5s infinite",
          }}
        >
          Cargando calendario de reservas...
        </p>
      ) : (
        <table border="1" className="calendar-table">
          <thead>
            <tr>
              <th>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  disabled={isLoading}
                />
              </th>
              <th>Mediodía</th>
              <th>Noche</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => {
              const filteredReservations = reservations.filter(
                (res) => res.date === selectedDate
              );
              return (
                <tr key={table.id}>
                  <td>{table.name}</td>
                  {["mediodía", "noche"].map((turno) => {
                    const isReserved = filteredReservations.some(
                      (res) => res.tableId === table.id && res.turno === turno
                    );
                    console.log("Checking reservation:", {
                      tableId: table.id,
                      turno,
                      date: selectedDate,
                      isReserved,
                    });

                    return (
                      <td
                        key={turno}
                        style={{
                          backgroundColor: isReserved ? "red" : "green",
                          color: "white",
                          cursor:
                            isLoading || isReserved ? "not-allowed" : "pointer",
                          opacity: isLoading ? 0.5 : 1,
                        }}
                        onClick={() =>
                          !isLoading &&
                          !isReserved &&
                          handleReservationClick(table.id, turno)
                        }
                      >
                        {isReserved ? "🟥 Reservado" : "🟩 Disponible"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {username === "admin" && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3 style={{ color: "#333" }}>Registrar Nuevo Usuario</h3>
          <form
            onSubmit={handleRegister}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: "5px", fontWeight: "bold" }}>
                Username:
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                disabled={isLoading}
                required
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: "5px", fontWeight: "bold" }}>
                Password:
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                required
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              <FontAwesomeIcon icon={faUserPlus} /> Registrar Usuario
            </button>
          </form>
        </div>
      )}
      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

export default Schedule;