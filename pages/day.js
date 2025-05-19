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
    <div className="min-h-screen bg-[#121225] text-cyan-300 font-mono p-6">
      <h1 className="text-3xl font-bold text-pink-500 mb-4">
        🎮 Eingabe für den {date ? new Date(date).toLocaleDateString('de-DE') : '...'}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block">Talktime (Sekunden)</label>
          <input
            type="number"
            name="talktime"
            value={formData.talktime}
            onChange={handleChange}
            className="w-full p-2 bg-black text-pink-300 border border-cyan-500 rounded"
          />
        </div>

        <div>
          <label className="block">AHT (Sekunden)</label>
          <input
            type="number"
            name="aht"
            value={formData.aht}
            onChange={handleChange}
            className="w-full p-2 bg-black text-pink-300 border border-cyan-500 rounded"
          />
        </div>

        <div>
          <label className="block">Geschäftsfallquote (%)</label>
          <input
            type="number"
            name="businesscase"
            value={formData.businesscase}
            onChange={handleChange}
            className="w-full p-2 bg-black text-pink-300 border border-cyan-500 rounded"
          />
        </div>

        <div>
          <label className="block">Contact Code (%)</label>
          <input
            type="number"
            name="contactcode"
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
          {loading ? 'Speichern...' : '💾 Speichern'}
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
