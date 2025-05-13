
import { useState } from 'react';

export default function Battle() {
  const [talktime, setTalktime] = useState('');
  const [aht, setAht] = useState('');
  const [businesscase, setBusinesscase] = useState('');
  const [contactcode, setContactcode] = useState('');
  const [points, setPoints] = useState(null);

  const calculatePoints = () => {
    let total = 0;

    // Talktime <= 340 sec = 2 pts, <= 374 sec = 1 pt
    const tt = parseFloat(talktime);
    if (tt <= 340) total += 2;
    else if (tt <= 374) total += 1;

    // AHT <= 20 sec = 2 pts, <= 22 sec = 1 pt
    const a = parseFloat(aht);
    if (a <= 20) total += 2;
    else if (a <= 22) total += 1;

    // Business case >= 85% = 2 pts, >= 76.5% = 1 pt
    const bc = parseFloat(businesscase);
    if (bc >= 85) total += 2;
    else if (bc >= 76.5) total += 1;

    // Contact code >= 85% = 2 pts, >= 76.5% = 1 pt
    const cc = parseFloat(contactcode);
    if (cc >= 85) total += 2;
    else if (cc >= 76.5) total += 1;

    setPoints(total);
  };

  return (
    <div style={{
      backgroundColor: '#111',
      color: '#00ffff',
      fontFamily: 'Press Start 2P, monospace',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1>🎯 Tages-Performance eintragen</h1>

      <form onSubmit={(e) => { e.preventDefault(); calculatePoints(); }} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '2rem'
      }}>
        <input
          type="number"
          step="0.01"
          placeholder="📞 Talktime (Sekunden)"
          value={talktime}
          onChange={(e) => setTalktime(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="🕒 Nachbearbeitungszeit (Sekunden)"
          value={aht}
          onChange={(e) => setAht(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="📊 Geschäftsfallquote (%)"
          value={businesscase}
          onChange={(e) => setBusinesscase(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="✅ Contact Code (%)"
          value={contactcode}
          onChange={(e) => setContactcode(e.target.value)}
          required
        />
        <button type="submit" style={{
          padding: '0.5rem 1rem',
          marginTop: '1rem',
          backgroundColor: '#00ffff',
          color: '#111',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Punkte berechnen
        </button>
      </form>

      {points !== null && (
        <div style={{ marginTop: '2rem', fontSize: '1rem' }}>
          <p>🏆 Deine Punktzahl heute: <strong>{points} Punkte</strong></p>
        </div>
      )}
    </div>
  );
}
