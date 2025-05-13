
import { useEffect, useState } from 'react';
import { format, addDays, isWeekend } from 'date-fns';
import { supabase } from '../lib/supabaseClient';

export default function Calendar() {
  const [user, setUser] = useState(null);
  const [days, setDays] = useState([]);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        loadEntries(data.user.id);
      }
    });
  }, []);

  const loadEntries = async (userId) => {
    const { data } = await supabase
      .from('scores')
      .select('date, points')
      .eq('user_id', userId)
      .order('date', { ascending: true });

    setEntries(data || []);
  };

  useEffect(() => {
    const start = new Date();
    const result = [];
    let day = new Date(start);
    while (result.length < 30) {
      if (!isWeekend(day)) {
        result.push({
          date: format(day, 'yyyy-MM-dd'),
          label: format(day, 'EEE dd.MM'),
          isToday: format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
        });
      }
      day = addDays(day, 1);
    }
    setDays(result);
  }, []);

  const getStatus = (date) => {
    const entry = entries.find(e => e.date === date);
    if (!entry) return '🔲 Offen';
    if (entry.points === 8) return '🏆 Perfekt';
    if (entry.points >= 6) return '🥈 Gut';
    if (entry.points >= 4) return '🥉 Ok';
    return '❌ Schwach';
  };

  return (
    <div style={{
      backgroundColor: '#0f0f0f',
      color: '#00ffff',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'Press Start 2P, monospace'
    }}>
      <h1 style={{ fontSize: '1rem', marginBottom: '2rem' }}>🗓️ Deine Battle-Tage (Mo–Fr)</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
        {days.map((day, i) => (
          <div key={i} style={{
            border: '2px solid #00ffff',
            borderRadius: '8px',
            padding: '1rem',
            backgroundColor: day.isToday ? '#002222' : '#111',
            boxShadow: day.isToday ? '0 0 10px #00ffff' : 'none'
          }}>
            <strong>{day.label}</strong>
            <p style={{ margin: '0.5rem 0' }}>{getStatus(day.date)}</p>
            {day.isToday && <a href="/battle"><button style={{
              marginTop: '0.5rem',
              padding: '0.4rem 0.8rem',
              fontSize: '0.6rem',
              backgroundColor: '#00ffff',
              color: '#111',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>Heute eintragen</button></a>}
          </div>
        ))}
      </div>
    </div>
  );
}
