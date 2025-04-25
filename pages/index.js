import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const createInitialData = () => {
  return Array.from({ length: 31 }, (_, i) => ({
    date: `${String(i + 1).padStart(2, "0")}.05`,
    mario: { talktime: 0, afterwork: 0, resolution: 0, businesscase: 0 },
    sonic: { talktime: 0, afterwork: 0, resolution: 0, businesscase: 0 },
  }));
};

const calculateScore = (person) =>
  person.talktime + person.afterwork + person.resolution + person.businesscase;

const getMedal = (score) => {
  if (score === 4) return "🥇 Gold";
  if (score === 3) return "🥈 Silber";
  if (score === 2) return "🥉 Bronze";
  return "";
};

const countMedals = (data, character) => {
  let gold = 0, silver = 0, bronze = 0;
  data.forEach(day => {
    const score = calculateScore(day[character]);
    if (score === 4) gold++;
    else if (score === 3) silver++;
    else if (score === 2) bronze++;
  });
  return { gold, silver, bronze };
};

const winSound = typeof Audio !== "undefined" ? new Audio("https://assets.mixkit.co/sfx/preview/mixkit-arcade-bonus-alert-767.wav") : null;

export default function Home() {
  const [data, setData] = useState(createInitialData());
  const [currentDay, setCurrentDay] = useState(0);
  const [highscore, setHighscore] = useState({ character: "", score: 0 });
  const [gameOver, setGameOver] = useState(false);

  const handleChange = (character, field, value) => {
    const newData = [...data];
    newData[currentDay][character][field] = parseInt(value) || 0;
    setData(newData);
  };

  const nextDay = () => {
    if (currentDay < data.length - 1) setCurrentDay(currentDay + 1);
  };

  const prevDay = () => {
    if (currentDay > 0) setCurrentDay(currentDay - 1);
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

    if (allFilled && winSound) {
      winSound.play();
    }
  }, [data]);

  const marioMedals = countMedals(data, "mario");
  const sonicMedals = countMedals(data, "sonic");
  const medalData = [
    { medal: "Gold", Mario: marioMedals.gold, Sonic: sonicMedals.gold },
    { medal: "Silber", Mario: marioMedals.silver, Sonic: sonicMedals.silver },
    { medal: "Bronze", Mario: marioMedals.bronze, Sonic: sonicMedals.bronze },
  ];

  const current = data[currentDay];

  return (
    <div>
      {/* Arcade Header */}
      <header>
        <img src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Neon_Game_Controller.svg" alt="Arcade Logo" />
        <h1>🎮 Retro Call Battle Arena</h1>
      </header>

      {/* Highscore Leader */}
      <div className="highscore">
        Highscore Leader: {highscore.character} mit {highscore.score} Punkten
      </div>

      {/* Tages-Navigation */}
      <div className="navigation">
        <button onClick={prevDay} disabled={currentDay === 0}>⬅️ Zurück</button>
        <span style={{ fontSize: "1.2rem" }}>Tag {current.date}</span>
        <button onClick={nextDay} disabled={currentDay === data.length - 1}>Weiter ➡️</button>
      </div>

      {/* Tages-Eingabe */}
      <div className="battle-card">
        <h2>Mario</h2>
        {["talktime", "afterwork", "resolution", "businesscase"].map((field) => (
          <input
            key={field}
            type="number"
            min="0"
            max="1"
            placeholder={field}
            value={current.mario[field]}
            onChange={(e) => handleChange("mario", field, e.target.value)}
          />
        ))}
        <div>Mario Punkte: {calculateScore(current.mario)} {getMedal(calculateScore(current.mario))}</div>

        <h2 style={{ marginTop: "1rem" }}>Sonic</h2>
        {["talktime", "afterwork", "resolution", "businesscase"].map((field) => (
          <input
            key={field}
            type="number"
            min="0"
            max="1"
            placeholder={field}
            value={current.sonic[field]}
            onChange={(e) => handleChange("sonic", field, e.target.value)}
          />
        ))}
        <div>Sonic Punkte: {calculateScore(current.sonic)} {getMedal(calculateScore(current.sonic))}</div>
      </div>

      {/* Medaillen-Statistik */}
      <div className="chart-container">
        <h2 style={{ color: "yellow", textAlign: "center", fontSize: "1.5rem", marginBottom: "1rem" }}>🏅 Medaillen-Statistik</h2>
        <BarChart width={600} height={300} data={medalData} style={{ margin: "0 auto" }}>
          <XAxis dataKey="medal" stroke="yellow" />
          <YAxis stroke="yellow" />
          <Tooltip contentStyle={{ backgroundColor: "#333", color: "lime" }} />
          <Legend />
          <Bar dataKey="Mario" fill="red" />
          <Bar dataKey="Sonic" fill="blue" />
        </BarChart>
      </div>

      {/* Game Over Screen */}
      {gameOver && (
        <div className="gameover">
          <p>🎉 GAME OVER 🎉</p>
          <p style={{ color: "limegreen", fontSize: "2rem" }}>🏆 Sieger: {highscore.character}</p>
        </div>
      )}
    </div>
  );
}
