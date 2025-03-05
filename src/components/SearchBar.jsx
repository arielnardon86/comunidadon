import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [mesa, setMesa] = useState('');
  const [cuando, setCuando] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = () => {
    onSearch({ mesa, cuando, date });
  };

  return (
    <div className="flex space-x-4">
      <select
        value={mesa}
        onChange={(e) => setMesa(e.target.value)}
        className="border p-2"
      >
        <option value="">Mesa</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      <select
        value={cuando}
        onChange={(e) => setCuando(e.target.value)}
        className="border p-2"
      >
        <option value="">Cuando</option>
        <option value="mediodia">Mediodía</option>
        <option value="noche">Noche</option>
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white p-2">
        Buscar
      </button>
    </div>
  );
}

export default SearchBar;