
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { format } from 'date-fns';

export default function Battle() {
  const [talktime, setTalktime] = useState('');
  const [aht, setAht] = useState('');
  const [businesscase, setBusinesscase] = useState('');
  const [contactcode, setContactcode] = useState('');
  const [points, setPoints] = useState(null);
  const [entries, setEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [showAchievement, setShowAchievement] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) loadEntries(data.user.id);
    });
  }, []);

  const getMedal = (pts) => {
    if (pts === 8) return '🏆';
    if (pts >= 6) return '🥈';
    if (pts >= 4) return '🥉';
    return '❌';
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
    const pts = calculatePoints();
    setPoints(pts);
    const today = format(new Date(), 'yyyy-MM-dd');

    if (pts === 8) {
      setShowAchievement(true);
      const audio = new Audio('/achievement.mp3');
      audio.play();
      setTimeout(() => setShowAchievement(false), 3000);
    }

    const { error } = await supabase.from('scores').upsert([{
      user_id: user.id,
      date: today,
      talktime: parseFloat(talktime),
      aht: parseFloat(aht),
      businesscase: parseFloat(businesscase),
      contactcode: parseFloat(contactcode),
      points: pts,
      completed: true
    }]);

    if (!error) {
      loadEntries(user.id);
    } else {
      console.error('Speicherfehler:', error.message);
    }
  };

  const loadEntries = async (userId) => {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(30);

    if (!error) setEntries(data);
  };

  return (
    <div style={{
      backgroundColor: '#111',
      color: '#00ffff',
      fontFamily: 'Press Start 2P, monospace',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
      position: 'relative'
    }}>
      {showAchievement && (
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#222',
          color: 'gold',
          padding: '2rem',
          border: '4px dashed gold',
          borderRadius: '12px',
          zIndex: 1000,
          fontSize: '1.2rem',
          animation: 'pop 0.5s ease'
        }}>
          🏆 Achievement Unlocked! <br />Perfect Day!
        </div>
      )}

      <h1>🎯 Tages-Performance</h1>

      <form onSubmit={(e) => { e.preventDefault(); saveEntry(); }} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '2rem'
      }}>
        <input type="number" step="0.01" placeholder="📞 Talktime (s)" value={talktime} onChange={(e) => setTalktime(e.target.value)} required />
        <input type="number" step="0.01" placeholder="🕒 AHT (s)" value={aht} onChange={(e) => setAht(e.target.value)} required />
        <input type="number" step="0.01" placeholder="📊 Geschäftsfallquote (%)" value={businesscase} onChange={(e) => setBusinesscase(e.target.value)} required />
        <input type="number" step="0.01" placeholder="✅ Contact Code (%)" value={contactcode} onChange={(e) => setContactcode(e.target.value)} required />
        <button type="submit" style={{
          padding: '0.5rem 1rem',
          marginTop: '1rem',
          backgroundColor: '#00ffff',
          color: '#111',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Speichern & Punkte berechnen
        </button>
      </form>

      {points !== null && (
        <div style={{ marginTop: '2rem', fontSize: '1rem' }}>
          <p>🏆 Heute erreicht: <strong>{points} Punkte</strong> {getMedal(points)}</p>
        </div>
      )}

      {entries.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h2>📅 Letzte 30 Tage</h2>
          <table style={{
            width: '100%',
            marginTop: '1rem',
            fontSize: '0.6rem',
            color: '#00ffff',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Talktime</th>
                <th>AHT</th>
                <th>Quote</th>
                <th>Code</th>
                <th>Punkte</th>
                <th>Medaillen</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, idx) => (
                <tr key={idx}>
                  <td>{e.date}</td>
                  <td>{e.talktime}</td>
                  <td>{e.aht}</td>
                  <td>{e.businesscase}%</td>
                  <td>{e.contactcode}%</td>
                  <td>{e.points}</td>
                  <td>{getMedal(e.points)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
