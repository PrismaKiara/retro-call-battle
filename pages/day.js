
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function DayPage() {
  const router = useRouter();
  const { date } = router.query;
  const [inputs, setInputs] = useState({ talktime: '', aht: '', caseQuote: '', contactCode: '' });

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Daten gesendet für', date, inputs);
  };
 

  return (
    <div style={{ fontFamily: 'monospace', background: '#1a1a2e', color: '#00ffff', minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ color: '#ff00ff' }}>📅 Tag: {date}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <label>Talktime (Sek.): <input name="talktime" type="number" value={inputs.talktime} onChange={handleChange} /></label>
        <label>AHT (Sek.): <input name="aht" type="number" value={inputs.aht} onChange={handleChange} /></label>
        <label>Geschäftsfallquote (%): <input name="caseQuote" type="number" value={inputs.caseQuote} onChange={handleChange} /></label>
        <label>Contact Code (%): <input name="contactCode" type="number" value={inputs.contactCode} onChange={handleChange} /></label>
        <button type="submit" style={{ background: '#ff00ff', color: '#fff', padding: '0.5rem', border: 'none' }}>💾 Speichern</button>
      </form>
       <div style={{
      backgroundColor: "#1e1e2f",
      color: "#00ffff",
      fontFamily: "Courier New, monospace",
      padding: "2rem",
      height: "100vh"
    }}>                                                  
    </div>
  );
}
