
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { format, parseISO, subDays, isWeekend } from 'date-fns';
import { useRouter } from 'next/router';

export default function Battle() {
  const router = useRouter();
  const queryDate = router.query.date;
  const [targetDate, setTargetDate] = useState('');
  const [user, setUser] = useState(null);
  const [editable, setEditable] = useState(false);
  const [existing, setExisting] = useState(null);
  const [points, setPoints] = useState(null);

  const [talktime, setTalktime] = useState('');
  const [aht, setAht] = useState('');
  const [businesscase, setBusinesscase] = useState('');
  const [contactcode, setContactcode] = useState('');

  useEffect(() => {
    const today = new Date();
    let previous = subDays(today, 1);
    while (isWeekend(previous)) previous = subDays(previous, 1);
    const previousStr = format(previous, 'yyyy-MM-dd');
    setTargetDate(queryDate || previousStr);

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) loadEntry(data.user.id, queryDate || previousStr);
    });

    if (!queryDate || queryDate === previousStr) {
      setEditable(true);
    }
  }, [queryDate]);

  const loadEntry = async (userId, date) => {
    const { data } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single();

    if (data) {
      setExisting(data);
      setTalktime(data.talktime);
      setAht(data.aht);
      setBusinesscase(data.businesscase);
      setContactcode(data.contactcode);
      setPoints(data.points);
    }
  };

  const calculatePoints = () => {
    let total = 0;
    const tt = parseFloat(talktime);
    const a = parseFloat(aht);
    const bc = parseFloat(businesscase);
    const cc = parseFloat(contactcode);

    if (tt <= 340) total += 2;
    else if (tt <= 374) total += 1;

    if (a <= 20) total += 2;
    else if (a <= 22) total += 1;

    if (bc >= 85) total += 2;
    else if (bc >= 76.5) total += 1;

    if (cc >= 85) total += 2;
    else if (cc >= 76.5) total += 1;

    return total;
  };

  const saveEntry = async () => {
    if (!editable) return alert('Nur der vorherige Werktag darf bearbeitet werden.');

    const pts = calculatePoints();
    setPoints(pts);

    const { error } = await supabase.from('scores').upsert([{
      user_id: user.id,
      date: targetDate,
      talktime: parseFloat(talktime),
      aht: parseFloat(aht),
      businesscase: parseFloat(businesscase),
      contactcode: parseFloat(contactcode),
      points: pts,
      completed: true
    }]);

    if (error) {
      alert('Fehler beim Speichern.');
    } else {
      alert('Eintrag gespeichert!');
    }
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
      <h1>📝 Tagesdaten: {targetDate}</h1>
      {!editable && <p style={{ color: 'orange', fontSize: '0.7rem' }}>🔒 Nur der vorherige Werktag darf bearbeitet werden</p>}

      <form onSubmit={(e) => { e.preventDefault(); saveEntry(); }} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '2rem'
      }}>
        <input type="number" step="0.01" placeholder="📞 Talktime (s)" value={talktime} onChange={(e) => setTalktime(e.target.value)} disabled={!editable} required />
        <input type="number" step="0.01" placeholder="🕒 AHT (s)" value={aht} onChange={(e) => setAht(e.target.value)} disabled={!editable} required />
        <input type="number" step="0.01" placeholder="📊 Geschäftsfallquote (%)" value={businesscase} onChange={(e) => setBusinesscase(e.target.value)} disabled={!editable} required />
        <input type="number" step="0.01" placeholder="✅ Contact Code (%)" value={contactcode} onChange={(e) => setContactcode(e.target.value)} disabled={!editable} required />
        {editable && (
          <button type="submit" style={{
            padding: '0.5rem 1rem',
            marginTop: '1rem',
            backgroundColor: '#00ffff',
            color: '#111',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Speichern
          </button>
        )}
      </form>

      {points !== null && (
        <div style={{ marginTop: '2rem', fontSize: '1rem' }}>
          <p>🏆 Punkte: <strong>{points}</strong></p>
        </div>
      )}
    </div>
  );
}
