
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import './styles.css';

const Day = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    talktime: '',
    aht: '',
    caseRate: '',
    contactCode: ''
  });
  const [date, setDate] = useState('');

  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isoDate = yesterday.toISOString().split('T')[0];
    setDate(isoDate);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('agent_entries').upsert({
      date,
      ...formData
    });
    if (error) {
      alert('Fehler beim Speichern.');
    } else {
      alert('Erfolgreich gespeichert!');
    }
  };

  return (
    <div className="retro-container">
      <h1 className="retro-title">🎮 Eingabe für den {new Date(date).toLocaleDateString()}</h1>
      <form onSubmit={handleSubmit}>
        <label>Talktime (Sekunden)</label>
        <input type="number" name="talktime" value={formData.talktime} onChange={handleChange} />
        <label>AHT (Sekunden)</label>
        <input type="number" name="aht" value={formData.aht} onChange={handleChange} />
        <label>Geschäftsfallquote (%)</label>
        <input type="number" name="caseRate" value={formData.caseRate} onChange={handleChange} />
        <label>Contact Code (%)</label>
        <input type="number" name="contactCode" value={formData.contactCode} onChange={handleChange} />
        <button type="submit" className="retro-button">💾 Speichern</button>
      </form>
      <Link href="/calendar"><button className="retro-button">🔙 Zurück zum Kalender</button></Link>
    </div>
  );
};

export default Day;
