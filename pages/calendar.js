
import React, { useEffect, useState } from 'react';
import { format, subDays, addDays, startOfToday } from 'date-fns';

const Calendar = () => {
  const startDate = startOfToday();
  const [currentDate, setCurrentDate] = useState(startDate);
  const days = Array.from({ length: 30 }, (_, i) => subDays(startDate, i)).reverse();

  const isYesterday = (date) => {
    const yesterday = subDays(startOfToday(), 1);
    return format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd');
  };

  return (
    <div style={{ backgroundColor: '#1c1b22', color: '#00fff7', fontFamily: 'monospace', padding: '2rem' }}>
      <h1 style={{ color: '#ff70a6', textAlign: 'center' }}>📅 Retro Call Battle Kalender</h1>
      <ul>
        {days.map((date) => (
          <li key={date} style={{
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: '#2d2c33',
            border: isYesterday(date) ? '2px solid #ff70a6' : '1px solid #00fff7',
            borderRadius: '8px',
            fontSize: '1.2rem'
          }}>
            {format(date, 'EEEE, dd.MM.yyyy')} - {isYesterday(date) ? '✍️ Bearbeitbar' : '🔒 Gesperrt'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Calendar;
