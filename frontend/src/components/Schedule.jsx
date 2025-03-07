import { useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

function Schedule({ tables, reservations, setReservations, token }) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleReservationClick = async (tableId, turno) => {
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

      const data = await response.json();
      setReservations((prevReservations) => [...prevReservations, data]);

      Swal.fire({
        icon: "success",
        title: "Reserva exitosa",
        text: `Has reservado la ${turno} del ${selectedDate}`,
      });
    } catch (error) {
      console.error("Error al reservar:", error);
      Swal.fire({
        icon: "error",
        title: "Error en el servidor",
        text: error.message,
      });
    }
  };

  return (
    <div>
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
                />
              </th>
              <th>Mediodía</th>
              <th>Noche</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table.id}>
                <td>{table.name}</td>
                {["mediodía", "noche"].map((turno) => {
                  const isReserved = reservations.some(
                    (res) =>
                      res.tableId === table.id &&
                      res.turno === turno &&
                      res.date === selectedDate
                  );

                  return (
                    <td
                      key={turno}
                      style={{
                        backgroundColor: isReserved ? "red" : "green",
                        color: "white",
                        cursor: isReserved ? "default" : "pointer",
                      }}
                      onClick={() =>
                        !isReserved && handleReservationClick(table.id, turno)
                      }
                    >
                      {isReserved ? "🟥 Reservado" : "🟩 Disponible"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Schedule;