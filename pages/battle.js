export default function Battle() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#00ffff',
      fontFamily: 'Press Start 2P, monospace',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1>🎮 Willkommen zur Battle Arena!</h1>
      <p>Trage deine Tageswerte ein und hol dir den Highscore!</p>
    </div>
  );
}
