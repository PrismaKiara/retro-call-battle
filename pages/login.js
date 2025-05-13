import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login-Fehler:', error.message);
      setError('Login fehlgeschlagen. Bitte überprüfe deine Daten.');
    } else {
      const user = data.user;
      const role = user?.user_metadata?.role;

      console.log('Login erfolgreich:', user.email);
      console.log('Rolle erkannt:', role);

      if (role === 'admin') {
        router.push('/admin');
      } else if (role === 'mario' || role === 'sonic') {
        router.push('/battle');
      } else {
        setError('Unbekannte Rolle – bitte Admin kontaktieren.');
      }
    }
  };

  return (
    <div style={{
      backgroundColor: '#0f0f0f',
      color: '#00ffcc',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Press Start 2P, sans-serif',
      padding: '2rem'
    }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>🎮 Login zur Battle Arena</h1>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: '0.6rem',
            border: '2px solid #00ffcc',
            borderRadius: '4px',
            backgroundColor: '#000',
            color: '#00ffcc',
            width: '260px'
          }}
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: '0.6rem',
            border: '2px solid #00ffcc',
            borderRadius: '4px',
            backgroundColor: '#000',
            color: '#00ffcc',
            width: '260px'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.8rem 1.5rem',
            backgroundColor: '#00ffcc',
            color: '#0f0f0f',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          🕹️ Einloggen
        </button>
      </form>

      {error && <p style={{ marginTop: '1rem', color: 'salmon' }}>{error}</p>}
    </div>
  );
}
