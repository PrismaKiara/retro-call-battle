
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';

export default function CalendarPage() {
  const [days, setDays] = useState([]);

  useEffect(() => {
    const startDate = new Date();
    const tempDays = [];
    for (let i = 0; i < 30; i++) {
      const current = addDays(startDate, i);
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        tempDays.push(current);
      }
    }
    setDays(tempDays);
  }, []);

  return (
    <div style={{ fontFamily: 'monospace', background: '#1a1a2e', color: '#00ffff', minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ color: '#ff00ff' }}>🗓️ Retro Battle Kalender</h1>
      <ul>
        {days.map((day, index) => (
          <li key={index}>
            <Link href={`/day?date=${format(day, 'yyyy-MM-dd')}`}>
              <button style={{ margin: '0.5rem', padding: '0.5rem 1rem', background: '#00ffff', color: '#1a1a2e', border: 'none', borderRadius: '5px' }}>
                {format(day, 'dd.MM.yyyy')}
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
