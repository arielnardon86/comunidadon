import React from 'react';

function VenuesList({ venues }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {venues.map((venue) => (
        <div key={venue.id} className="border p-4">
          <h3>{venue.name}</h3>
          <p>{venue.location}</p>
          <p>{venue.sport}</p>
        </div>
      ))}
    </div>
  );
}

export default VenuesList;