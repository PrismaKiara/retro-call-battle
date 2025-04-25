import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const initialData = [
  { date: "01.05", mario: 0, sonic: 0 },
  { date: "02.05", mario: 0, sonic: 0 },
  { date: "03.05", mario: 0, sonic: 0 },
  { date: "04.05", mario: 0, sonic: 0 },
  { date: "05.05", mario: 0, sonic: 0 },
  { date: "06.05", mario: 0, sonic: 0 },
  { date: "07.05", mario: 0, sonic: 0 },
];

const coinSound = typeof Audio !== "undefined" ? new Audio("https://assets.mixkit.co/sfx/preview/mixkit-arcade-retro-changing-tab-206.wav") : null;

export default function Home() {
  const [data, setData] = useState(initialData);
  const [highscore, setHighscore] = useState({ character: "", score: 0 });
  const [gameOver, setGameOver] = useState(false);

  const handleChange = (index, character, value) => {
    const newData = [...data];
    newData[index][character] = parseInt(value) || 0;
    setData(newData);
    if (coinSound) coinSound.play();
  };

  useEffect(() => {
    const isGameOver = data.every(entry => entry.mario > 0 || entry.sonic > 0);
    setGameOver(isGameOver);

    let marioTotal = data.reduce((sum, d) => sum + d.mario, 0);
    let sonicTotal = data.reduce((sum, d) => sum + d.sonic, 0);
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
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "black", color: "red", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>
          <p>GAME OVER</p>
          <p style={{ color: "limegreen", fontSize: "2rem" }}>Sieger: {highscore.character}</p>
          <p style={{ fontSize: "1.5rem" }}>Total Points: {highscore.score}</p>
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "2rem" }}>
        {data.map((entry, index) => (
          <div key={index} style={{ border: "1px solid yellow", padding: "1rem", borderRadius: "1rem", width: "250px", backgroundColor: "#111" }}>
            <h2>Day {entry.date}</h2>
            <input
              type="number"
              placeholder="Mario Score"
              value={entry.mario}
              onChange={(e) => handleChange(index, "mario", e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem", backgroundColor: "black", color: "limegreen", border: "1px solid limegreen" }}
            />
            <input
              type="number"
              placeholder="Sonic Score"
              value={entry.sonic}
              onChange={(e) => handleChange(index, "sonic", e.target.value)}
              style={{ width: "100%", backgroundColor: "black", color: "limegreen", border: "1px solid limegreen" }}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: "3rem" }}>
        <BarChart width={600} height={300} data={data} style={{ margin: "0 auto" }}>
          <XAxis dataKey="date" stroke="yellow" />
          <YAxis stroke="yellow" />
          <Tooltip contentStyle={{ backgroundColor: "#333", color: "lime" }} />
          <Legend />
          <Bar dataKey="mario" name="Mario" fill="red" />
          <Bar dataKey="sonic" name="Sonic" fill="blue" />
        </BarChart>
      </div>
    </div>
  );
}
