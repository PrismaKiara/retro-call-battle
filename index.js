
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, []);

  return (
    <div style={{
      backgroundColor: '#1a1a2e',
      color: 'white',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Press Start 2P, sans-serif',
      fontSize: '1.5rem',
      textAlign: 'center',
      padding: '2rem'
    }}>
      Lade Retro Call Battle Arena...
    </div>
  );
}
