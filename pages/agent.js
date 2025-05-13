
import { useEffect, useState } from 'react';
import { format, addDays, isWeekend } from 'date-fns';
import { supabase } from '../lib/supabaseClient';

export default function AgentLanding() {
  const [user, setUser] = useState(null);
  const [today, setToday] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [displayDate, setDisplayDate] = useState('');
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const usr = data.user;
      setUser(usr);

      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const localizedDate = new Date().toLocaleDateString('de-DE', options);
      setDisplayDate(localizedDate);

      if (usr) {
        checkEntry(usr.id);
        loadProgress(usr.id);
      }
    });
  }, []);

  const checkEntry = async (userId) => {
    const { data } = await supabase
      .from('scores')
      .select('points')
      .eq('user_id', userId)
      .eq('date', format(new Date(), 'yyyy-MM-dd'))
      .single();

    if (!data) {
      setStatus('🔲 Noch nicht eingetragen');
    } else {
      const pts = data.points;
      if (pts === 8) setStatus('🏆 Perfekt');
      else if (pts >= 6) setStatus('🥈 Gut');
      else if (pts >= 4) setStatus('🥉 Ok');
      else setStatus('❌ Schwach');
    }
  };

  const loadProgress = async (userId) => {
    const start = new Date();
    const allDays = [];
    let date = new Date(start);
    while (allDays.length < 30) {
      if (!isWeekend(date)) {
        allDays.push(format(date, 'yyyy-MM-dd'));
      }
      date = addDays(date, 1);
    }

    const { data } = await supabase
      .from('scores')
      .select('date')
      .eq('user_id', userId);

    const completed = data?.filter(entry => allDays.includes(entry.date)).length || 0;
    setProgress(Math.round((completed / allDays.length) * 100));
  };

  return (
    <div style={{
      backgroundColor: '#0f0f0f',
      color: '#00ffff',
      fontFamily: 'Press Start 2P, monospace',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1>🎮 Willkommen zur Battle Arena!</h1>
      <p style={{ margin: '1rem 0', fontSize: '0.8rem' }}>
        Heute ist <strong>{displayDate}</strong>
      </p>
      <p style={{ marginBottom: '1.5rem', fontSize: '0.7rem' }}>
        Status: {status || '⏳ Lade...'}
      </p>

      <a href="/battle">
        <button style={{
          padding: '0.6rem 1.2rem',
          backgroundColor: '#00ffff',
          color: '#111',
          border: 'none',
          borderRadius: '5px',
          fontSize: '0.7rem',
          cursor: 'pointer',
          marginBottom: '1rem'
        }}>
          ➡️ Tageswerte eintragen
        </button>
      </a>

      <div style={{ width: '80%', marginTop: '1rem' }}>
        <p style={{ fontSize: '0.7rem' }}>📊 Fortschritt: {progress}%</p>
        <div style={{
          height: '10px',
          backgroundColor: '#333',
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#00ffff'
          }}></div>
        </div>
      </div>

      <a href="/calendar" style={{ marginTop: '1.5rem', fontSize: '0.7rem', textDecoration: 'underline', color: '#00ffff' }}>
        📅 Zum Monatskalender
      </a>
    </div>
  );
}
