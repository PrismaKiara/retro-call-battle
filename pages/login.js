
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Login fehlgeschlagen! ❌');
    } else {
      const { user } = data;
      const role = data.user.user_metadata?.role;

      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
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
      <h1 style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>🎮 Retro Call Battle Login</h1>
      
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: '0.6rem',
          marginBottom: '1rem',
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
          marginBottom: '1rem',
          border: '2px solid #00ffcc',
          borderRadius: '4px',
          backgroundColor: '#000',
          color: '#00ffcc',
          width: '260px'
        }}
      />
      <button
        onClick={handleLogin}
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

      {error && <p style={{ marginTop: '1rem', color: 'red' }}>{error}</p>}
    </div>
  );
}
