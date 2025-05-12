
export default function Admin() {
  return (
    <div style={{
      backgroundColor: '#0f0f0f',
      color: '#00ffcc',
      height: '100vh',
      padding: '2rem',
      fontFamily: 'Press Start 2P, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>👨‍💼 Admin Dashboard</h1>
      <p style={{ fontSize: '0.9rem', maxWidth: '600px' }}>
        Hier kannst du die Tagesergebnisse überwachen, Punkte einsehen, und den Spielverlauf verfolgen.
      </p>
      <p style={{ fontSize: '0.75rem', marginTop: '2rem', color: '#888' }}>
        (Funktionen werden in Kürze ergänzt!)
      </p>
    </div>
  );
}
