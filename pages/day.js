
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';

export default function DayPage() {
  const router = useRouter();
  const { date } = router.query;
  const [inputs, setInputs] = useState({
    talktime: '',
    aht: '',
    caseQuote: '',
    contactCode: '',
  });

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Gespeichert:', { date, ...inputs });
    alert('Werte gespeichert!');
  };

  return (
    <div style={{
      fontFamily: 'monospace',
      backgroundColor: '#121225',
      color: '#00ffff',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <h1 style={{ color: '#ff00ff' }}>📅 Werte für {date}</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>Talktime (Sekunden): <input name="talktime" type="number" value={inputs.talktime} onChange={handleChange} /></label>
        <label>AHT (Sekunden): <input name="aht" type="number" value={inputs.aht} onChange={handleChange} /></label>
        <label>Geschäftsfallquote (%): <input name="caseQuote" type="number" value={inputs.caseQuote} onChange={handleChange} /></label>
        <label>Contact Code (%): <input name="contactCode" type="number" value={inputs.contactCode} onChange={handleChange} /></label>
        <button type="submit" style={{ backgroundColor: '#ff00ff', color: '#fff', padding: '0.5rem', border: 'none' }}>💾 Speichern</button>
      </form>
      <Link href="/calendar">
        <button style={{
          marginTop: '2rem',
          backgroundColor: '#00ffff',
          color: '#000',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>
          🔙 Zurück zum Kalender
        </button>
      </Link>
    </div>
  );
}
