import { useState, useEffect } from "react";

const createInitialData = () => {
  const days = Array.from({ length: 31 }, (_, i) => ({
    date: `${(i + 1).toString().padStart(2, "0")}.05`,
    mario: { talktime: 0, afterwork: 0, resolution: 0, businesscase: 0 },
    sonic: { talktime: 0, afterwork: 0, resolution: 0, businesscase: 0 },
  }));
  return days;
};

const calculateScore = (person) => {
  return person.talktime + person.afterwork + person.resolution + person.businesscase;
};

const getMedal = (score) => {
  if (score === 4) return "🥇 Gold";
  if (score === 3) return "🥈 Silber";
  if (score === 2) return "🥉 Bronze";
  return "";
};

export default function Home() {
  const [data, setData] = useState(createInitialData());
  const [highscore, setHighscore] = useState({ character: "", score: 0 });
  const [gameOver, setGameOver] = useState(false);

  const handleChange = (index, character, field, value) => {
    const newData = [...data];
    newData[index][character][field] = parseInt(value) || 0;
    setData(newData);
  };

  useEffect(() => {
    const allFilled = data.every(day => calculateScore(day.mario) > 0 || calculateScore(day.sonic) > 0);
    setGameOver(allFilled);

    const marioTotal = data.reduce((sum, d) => sum + calculateScore(d.mario), 0);
    const sonicTotal = data.reduce((sum, d) => sum + calculateScore(d.sonic), 0);

    if (marioTotal > sonicTotal) {
      setHighscore({ character: "Mario", score: marioTotal });
    } else if (sonicTotal > marioTotal) {
      setHighscore({ character: "Sonic", score: sonicTotal });
    } else {
      setHighscore({ character: "Unentschieden", score: marioTotal });
    }
  }, [data]);

  return (
    <div style={{ fontFamily: "monospace", backgroundColor: "black", color: "limegreen", minHeight: "100vh", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", textAlign: "center", color: "yellow" }}>Retro Call Battle: Mario vs Sonic</h1>

      <div style={{ margin: "1rem 0", backgroundColor: "yellow", color: "black", textAlign: "center", padding: "1rem", borderRadius: "1rem" }}>
        Highscore Leader: {highscore.character} mit {highscore.score} Punkten
      </div>

      {gameOver && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "black", color: "red", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>
          <p>GAME OVER</p>
          <p style={{ color: "limegreen", fontSize: "2rem" }}>Sieger: {highscore.character}</p>
          <p style={{ fontSize: "1.5rem" }}>Total Points: {highscore.score}</p>
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "2rem" }}>
        {data.map((entry, index) => (
          <div key={index} style={{ border: "1px solid yellow", padding: "1rem", borderRadius: "1rem", width: "280px", backgroundColor: "#111" }}>
            <h2>Day {entry.date}</h2>

            <h3>Mario</h3>
            {["talktime", "afterwork", "resolution", "businesscase"].map((field) => (
              <input
                key={field}
                type="number"
                min="0"
                max="1"
                placeholder={field}
                value={entry.mario[field]}
                onChange={(e) => handleChange(index, "mario", field, e.target.value)}
                style={{ width: "100%", marginBottom: "0.25rem", backgroundColor: "black", color: "limegreen", border: "1px solid limegreen" }}
              />
            ))}
            <div>Mario Punkte: {calculateScore(entry.mario)} {getMedal(calculateScore(entry.mario))}</div>

            <h3 style={{ marginTop: "1rem" }}>Sonic</h3>
            {["talktime", "afterwork", "resolution", "businesscase"].map((field) => (
              <input
                key={field}
                type="number"
                min="0"
                max="1"
                placeholder={field}
                value={entry.sonic[field]}
                onChange={(e) => handleChange(index, "sonic", field, e.target.value)}
                style={{ width: "100%", marginBottom: "0.25rem", backgroundColor: "black", color: "limegreen", border: "1px solid limegreen" }}
              />
            ))}
            <div>Sonic Punkte: {calculateScore(entry.sonic)} {getMedal(calculateScore(entry.sonic))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
