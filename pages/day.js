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
    alert(`Werte für ${date} gespeichert!`);
    // Hier kannst du die Werte an Supabase oder eine API senden
  };

  return (
    <div style={{
      backgroundColor: '#191929',
      color: '#00ffff',
      fontFamily: 'monospace',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <h1 style={{ color: '#ff00ff' }}>🎮 Tagesansicht für {new Date(date).toLocaleDateString('de-DE')}</h1>
      <p>Hier kannst du deine heutigen Werte einsehen oder bearbeiten.</p>

      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <label>Talktime (Sek.): <input type="number" name="talktime" value={inputs.talktime} onChange={handleChange} /></label>
        <label>AHT (Sek.): <input type="number" name="aht" value={inputs.aht} onChange={handleChange} /></label>
        <label>Geschäftsfallquote (%): <input type="number" name="caseQuote" value={inputs.caseQuote} onChange={handleChange} /></label>
        <label>Contact Code (%): <input type="number" name="contactCode" value={inputs.contactCode} onChange={handleChange} /></label>

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
          ⬅️ Zurück zum Kalender
        </button>
      </Link>
    </div>
  );
}
