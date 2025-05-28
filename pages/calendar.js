
import React from 'react';
import Link from 'next/link';

const Calendar = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  const formattedDate = today.toISOString().split('T')[0];

  return (
    <div className="retro-container">
      <h1 className="retro-title">📅 Retro Tagesübersicht</h1>
      <p>🔹 Starte mit dem Tag: <strong>{formattedDate}</strong></p>
      <Link href={`/day?date=${formattedDate}`}>
        <button className="retro-button">🕹️ Los geht's</button>
      </Link>
    </div>
  );
};

export default Calendar;
