import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function DayView() {
  const router = useRouter();
  const { date: rawDate } = router.query;
  const date = rawDate || new Date(Date.now() - 86400000).toISOString().split('T')[0]; // Vortag als Default

  const [formData, setFormData] = useState({
    talktime: '',
    aht: '',
    businesscase: '',
    contactcode: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (date) loadData();
  }, [date]);

  const loadData = async () => {
    const session = await supabase.auth.getSession();
    const email = session?.data?.session?.user?.email;
    if (!email) return;

    const { data } = await supabase
      .from('entries')
      .select('*')
      .eq('email', email)
      .eq('date', date)
      .single();

    if (data) {
      setFormData({
        talktime: data.talktime || '',
        aht: data.aht || '',
        businesscase: data.businesscase || '',
        contactcode: data.contactcode || '',
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const session = await supabase.auth.getSession();
    const email = session?.data?.session?.user?.email;
    if (!email) return;

    await supabase
      .from('entries')
      .upsert({ email, date, ...formData });

    setSuccessMessage('✅ Werte gespeichert!');
    setLoading(false);
  };

  return (
    <div className="day-container">
      <style jsx>{`
        .day-container {
          background-color: #121225;
          color: #00ffff;
          min-height: 100vh;
          padding: 2rem;
          font-family: 'Courier New', monospace;
        }

        h1 {
          color: #ff00cc;
          font-size: 2rem;
        }

        label {
          display: block;
          margin-top: 1rem;
          margin-bottom: 0.25rem;
        }

        input {
          width: 100%;
          padding: 0.5rem;
          background-color: black;
          color: #ff00cc;
          border: 1px solid #00ffff;
          border-radius: 5px;
        }

        button {
          margin-top: 1rem;
          background-color: #ff00cc;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          cursor: pointer;
          border-radius: 5px;
        }

        button:hover {
          background-color: #e600a1;
        }

        .back-link {
          display: inline-block;
          margin-top: 2rem;
          color: #00ffff;
          text-decoration: underline;
          cursor: pointer;
        }
      `}</style>

      <h1>🎮 Eingabe für den {date ? new Date(date).toLocaleDateString('de-DE') : '...'}</h1>

      <form onSubmit={handleSubmit}>
        <label>Talktime (Sekunden)</label>
        <input
          type="number"
          name="talktime"
          value={formData.talktime}
          onChange={handleChange}
        />

        <label>AHT (Sekunden)</label>
        <input
          type="number"
          name="aht"
          value={formData.aht}
          onChange={handleChange}
        />

        <label>Geschäftsfallquote (%)</label>
        <input
          type="number"
          name="businesscase"
          value={formData.businesscase}
          onChange={handleChange}
        />

        <label>Contact Code (%)</label>
        <input
          type="number"
          name="contactcode"
          value={formData.contactcode}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          💾 {loading ? 'Speichern...' : 'Speichern'}
        </button>
      </form>

      {successMessage && <p>{successMessage}</p>}

      <div>
        <Link href="/calendar">
          <span className="back-link">⬅ Zurück zum Kalender</span>
        </Link>
      </div>
    </div>
  );
}
