import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function DayView() {
  const router = useRouter();
  const { date } = router.query;

  const [formData, setFormData] = useState({
    talktime: '',
    aht: '',
    businesscase: '',
    contactcode: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (date) {
      loadData();
    }
  }, [date]);

  const loadData = async () => {
    const user = supabase.auth.getUser();
    const { data: session } = await supabase.auth.getSession();
    const email = session?.session?.user?.email;

    if (!email) return;

    const { data, error } = await supabase
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

    const { data: session } = await supabase.auth.getSession();
    const email = session?.session?.user?.email;

    const { error } = await supabase
      .from('entries')
      .upsert({
        email,
        date,
        ...formData,
      });

    if (!error) {
      setSuccessMessage('Erfolgreich gespeichert!');
    }

    setLoading(false);
  };

  const formatDate = (input) => {
    const d = new Date(input);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white p-6 font-mono">
      <h1 className="text-3xl text-pink-500 font-bold mb-4 flex items-center gap-2">
        🎮 Tagesansicht für {date && formatDate(date)}
      </h1>

      <p className="text-cyan-300 mb-6">
        Hier kannst du deine heutigen Werte einsehen oder bearbeiten.
      </p>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-cyan-300">Talktime (sec):</label>
          <input
            name="talktime"
            type="number"
            value={formData.talktime}
            onChange={handleChange}
            className="w-full p-2 bg-black text-pink-300 border border-cyan-500 rounded"
          />
        </div>

        <div>
          <label className="block text-cyan-300">AHT (sec):</label>
          <input
            name="aht"
            type="number"
            value={formData.aht}
            onChange={handleChange}
            className="w-full p-2 bg-black text-pink-300 border border-cyan-500 rounded"
          />
        </div>

        <div>
          <label className="block text-cyan-300">Geschäftsfallquote (%):</label>
          <input
            name="businesscase"
            type="number"
            value={formData.businesscase}
            onChange={handleChange}
            className="w-full p-2 bg-black text-pink-300 border border-cyan-500 rounded"
          />
        </div>

        <div>
          <label className="block text-cyan-300">Contact Code (%):</label>
          <input
            name="contactcode"
            type="number"
            value={formData.contactcode}
            onChange={handleChange}
            className="w-full p-2 bg-black text-pink-300 border border-cyan-500 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded"
        >
          {loading ? 'Speichern...' : 'Speichern'}
        </button>

        {successMessage && (
          <p className="text-green-400 mt-2">{successMessage}</p>
        )}
      </form>

      <div className="mt-6">
        <Link href="/calendar">
          <span className="inline-block mt-4 text-cyan-300 hover:underline cursor-pointer">
            ⬅ Zurück zum Kalender
          </span>
        </Link>
      </div>
    </div>
  );
}
