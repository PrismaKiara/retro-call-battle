
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Admin() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('date', { ascending: false });

      if (!error) setScores(data);
    };

    fetchScores();
  }, []);

  const exportCSV = () => {
    const headers = ['Date', 'User ID', 'Talktime', 'AHT', 'Business Case', 'Contact Code', 'Points', 'Completed'];
    const rows = scores.map(score => [
      score.date,
      score.user_id,
      score.talktime,
      score.aht,
      score.businesscase,
      score.contactcode,
      score.points,
      score.completed ? 'Yes' : 'No'
    ]);

    const csvContent = [headers, ...rows]
      .map(e => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'battle_scores.csv');
    link.click();
  };

  return (
    <div style={{
      backgroundColor: '#0f0f0f',
      color: '#00ffcc',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'Press Start 2P, sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '1.3rem', marginBottom: '2rem' }}>📋 Admin Übersicht</h1>

      <button onClick={exportCSV} style={{
        marginBottom: '1rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#00ffcc',
        color: '#0f0f0f',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontFamily: 'inherit'
      }}>
        📤 Export als CSV
      </button>

      <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.6rem',
          marginTop: '1rem',
          color: '#00ffcc'
        }}>
          <thead>
            <tr>
              <th>Datum</th>
              <th>User ID</th>
              <th>Talktime</th>
              <th>AHT</th>
              <th>Business Case</th>
              <th>Contact Code</th>
              <th>Punkte</th>
              <th>Abgeschlossen</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={index}>
                <td>{score.date}</td>
                <td>{score.user_id}</td>
                <td>{score.talktime}</td>
                <td>{score.aht}</td>
                <td>{score.businesscase}</td>
                <td>{score.contactcode}</td>
                <td>{score.points}</td>
                <td>{score.completed ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
