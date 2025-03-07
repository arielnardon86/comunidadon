import { useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faSpinner } from "@fortawesome/free-solid-svg-icons"; // Importar el ícono de spinner

function Schedule({ tables, reservations, setReservations, token }) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la carga

  const apiUrl = import.meta.env.VITE_API_URL || "https://comunidadon-backend.onrender.com";

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleReservationClick = async (tableId, turno) => {
    setIsLoading(true); // Activar el estado de carga
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

      // Si la reserva se crea con éxito, recargar las reservas
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
      setIsLoading(false); // Desactivar el estado de carga al finalizar
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Overlay para mostrar el spinner mientras se carga */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semi-transparente
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
        <p>No hay mesas disponibles</p>
      ) : (
        <table border="1" className="calendar-table">
          <thead>
            <tr>
              <th>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  disabled={isLoading} // Desactivar el input de fecha mientras se carga
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
                            isLoading || isReserved ? "not-allowed" : "pointer", // Cambiar cursor si está cargando o reservado
                          opacity: isLoading ? 0.5 : 1, // Reducir opacidad mientras carga
                        }}
                        onClick={() =>
                          !isLoading &&
                          !isReserved &&
                          handleReservationClick(table.id, turno)
                        } // Desactivar clics mientras se carga
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
    </div>
  );
}

export default Schedule;