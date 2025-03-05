import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Schedule from './components/Schedule';
import ClubInfo from './ClubInfo'; // Importa el componente ClubInfo
import DateSelector from './components/DateSelector'; // Importa el nuevo selector de fecha

function App() {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedTurn, setSelectedTurn] = useState('');
  const [date, setDate] = useState(new Date()); // Ahora date es un objeto Date

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tablesRes = await fetch('http://localhost:3001/api/tables');
        const tablesData = await tablesRes.json();
        setTables(tablesData);

        const reservationsRes = await fetch('http://localhost:3001/api/reservations');
        const reservationsData = await reservationsRes.json();
        setReservations(reservationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleReserve = async () => {
    if (!selectedTable || !selectedTurn || !date) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios',
        text: 'Todos los campos son obligatorios',
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: Number(selectedTable),
          turno: selectedTurn,
          date: date.toISOString().split('T')[0], // Formato YYYY-MM-DD
        }),
      });

      const data = await response.json();

      if (data.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al reservar',
          text: data.error,
        });
      } else {
        setReservations((prevReservations) => [...prevReservations, data]);

        Swal.fire({
          icon: 'success',
          title: 'Reserva realizada',
          text: 'Tu reserva se ha realizado con éxito',
        });

        setSelectedTable('');
        setSelectedTurn('');
        setDate(new Date()); // Resetear la fecha al día actual
      }
    } catch (error) {
      console.error('Error al reservar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error en el servidor',
        text: 'Hubo un problema al realizar la reserva',
      });
    }
  };

  return (
    <div className="p-4">
      <h1>Reservar Mesa</h1>

      <label>Mesa:</label>
      <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
        <option value="">Seleccione una mesa</option>
        {tables.map((table) => (
          <option key={table.id} value={table.id}>{table.name}</option>
        ))}
      </select>

      <label>Turno:</label>
      <select value={selectedTurn} onChange={(e) => setSelectedTurn(e.target.value)}>
        <option value="">Seleccione un turno</option>
        <option value="tarde">Tarde</option>
        <option value="noche">Noche</option>
      </select>

      <label>Fecha:</label>
      {/* Se reemplaza el input type="date" por DateSelector */}
      <DateSelector selectedDate={date} setSelectedDate={setDate} />

      <button className="custom-button" onClick={handleReserve}>Reservar</button>

      <Schedule className="calendar-table" selectedDate={date} reservations={reservations} /> 
      <div style={{ maxWidth: '600px', margin: '20px auto' }}> {/* Contenedor con ancho máximo */}
        <ClubInfo />
      </div>
    </div>
  );
}

export default App;
