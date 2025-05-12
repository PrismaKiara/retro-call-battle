
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      const role = data.user.user_metadata.role;
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
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Press Start 2P, sans-serif',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>🎮 Retro Call Battle Login</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
        <input
          type="email"
          placeholder="📧 Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '0.75rem',
            borderRadius: '5px',
            border: '2px solid #00ffcc',
            backgroundColor: '#1f1f1f',
            color: '#00ffcc',
            fontFamily: 'inherit'
          }}
        />
        <input
          type="password"
          placeholder="🔑 Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: '0.75rem',
            borderRadius: '5px',
            border: '2px solid #00ffcc',
            backgroundColor: '#1f1f1f',
            color: '#00ffcc',
            fontFamily: 'inherit'
          }}
        />
        <button type="submit" style={{
          padding: '0.75rem',
          backgroundColor: '#00ffcc',
          color: '#0f0f0f',
          border: 'none',
          borderRadius: '5px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontFamily: 'inherit'
        }}>🎮 Einloggen</button>
      </form>
      {error && <p style={{ color: 'salmon', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}
