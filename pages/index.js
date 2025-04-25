import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const createInitialData = () => {
  return Array.from({ length: 31 }, (_, i) => ({
    date: `${String(i + 1).padStart(2, "0")}.05`,
    mario: { talktime: "", afterwork: "", businesscase: "", contactcode: "" },
    sonic: { talktime: "", afterwork: "", businesscase: "", contactcode: "" },
  }));
};

const calculatePoints = (value, target, type = "lower") => {
  if (value === "") return 0;

  if (type === "lower") {
    if (value <= target) return 2;
    if (value <= target * 1.1) return 1;
    return 0;
  } else {
    if (value >= target) return 2;
    if (value >= target * 0.9) return 1;
    return 0;
  }
};

const getMedal = (total) => {
  if (total >= 7) return "🥇 Gold";
  if (total >= 5) return "🥈 Silber";
  if (total >= 3) return "🥉 Bronze";
  return "";
};

const winSound = typeof Audio !== "undefined"
  ? new Audio("https://assets.mixkit.co/sfx/preview/mixkit-arcade-bonus-alert-767.wav")
  : null;

export default function Home() {
  const [data, setData] = useState(createInitialData());
  const [currentDay, setCurrentDay] = useState(0);
  const [highscore, setHighscore] = useState({ character: "", score: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [achievementUnlocked, setAchievementUnlocked] = useState(false);

  const handleChange = (character, field, value) => {
    const newData = [...data];
    newData[currentDay][character][field] = value;
    setData(newData);
  };

  const nextDay = () => {
    if (currentDay < data.length - 1) setCurrentDay(currentDay + 1);
  };

  const prevDay = () => {
    if (currentDay > 0) setCurrentDay(currentDay - 1);
  };

  const calculateTotal = (person) => {
    return (
      calculatePoints(person.talktime, 340, "lower") +
      calculatePoints(person.afterwork, 20, "lower") +
      calculatePoints(person.businesscase, 85, "higher") +
      calculatePoints(person.contactcode, 85, "higher")
    );
  };

  useEffect(() => {
    const allFilled = data.every(day =>
      ["mario", "sonic"].some(char =>
        day[char].talktime !== "" || day[char].afterwork !== "" || day[char].businesscase !== "" || day[char].contactcode !== ""
      )
    );
    setGameOver(allFilled);

    const marioTotal = data.reduce((sum, d) => sum + calculateTotal(d.mario), 0);
    const sonicTotal = data.reduce((sum, d) => sum + calculateTotal(d.sonic), 0);

    if (marioTotal > sonicTotal) {
      setHighscore({ character: "Mario", score: marioTotal });
    } else if (sonicTotal > marioTotal) {
      setHighscore({ character: "Sonic", score: sonicTotal });
    } else {
      setHighscore({ character: "Unentschieden", score: marioTotal });
    }

    // 🏆 Achievement wenn volle Punkte an einem Tag
    const todayMario = calculateTotal(data[currentDay]?.mario || {});
    const todaySonic = calculateTotal(data[currentDay]?.sonic || {});
    if (todayMario === 8 || todaySonic === 8) {
      setAchievementUnlocked(true);
      setTimeout(() => setAchievementUnlocked(false), 3000);
    }

    if (allFilled && winSound) {
      winSound.play();
    }
  }, [data, currentDay]);

  const medalData = [
    { medal: "Gold", Mario: data.filter(d => getMedal(calculateTotal(d.mario)) === "🥇 Gold").length, Sonic: data.filter(d => getMedal(calculateTotal(d.sonic)) === "🥇 Gold").length },
    { medal: "Silber", Mario: data.filter(d => getMedal(calculateTotal(d.mario)) === "🥈 Silber").length, Sonic: data.filter(d => getMedal(calculateTotal(d.sonic)) === "🥈 Silber").length },
    { medal: "Bronze", Mario: data.filter(d => getMedal(calculateTotal(d.mario)) === "🥉 Bronze").length, Sonic: data.filter(d => getMedal(calculateTotal(d.sonic)) === "🥉 Bronze").length },
  ];

  const current = data[currentDay];

  return (
    <div>
      <header>
        <img src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Neon_Game_Controller.svg" alt="Arcade Logo" />
        <h1>🎮 Retro Call Battle Arena</h1>
      </header>

      <div className="highscore">
        Highscore Leader: {highscore.character} mit {highscore.score} Punkten
      </div>

      <div className="navigation">
        <button onClick={prevDay} disabled={currentDay === 0}>⬅️ Zurück</button>
        <span style={{ fontSize: "1.2rem" }}>Tag {current.date}</span>
        <button onClick={nextDay} disabled={currentDay === data.length - 1}>Weiter ➡️</button>
      </div>

      <div className="battle-card">
        <h2>Mario</h2>
        {[
          { field: "talktime", label: "⏱️ Talktime (sec)" },
          { field: "afterwork", label: "🖋️ Nachbearbeitung (sec)" },
          { field: "businesscase", label: "📈 Geschäftsfallquote (%)" },
          { field: "contactcode", label: "📊 Contact Code (%)" },
        ].map(({ field, label }) => (
          <input
            key={field}
            type="number"
            placeholder={label}
            value={current.mario[field]}
            onChange={(e) => handleChange("mario", field, e.target.value)}
          />
        ))}
        <div>Mario Punkte: {calculateTotal(current.mario)} {getMedal(calculateTotal(current.mario))}</div>

        <h2 style={{ marginTop: "1rem" }}>Sonic</h2>
        {[
          { field: "talktime", label: "⏱️ Talktime (sec)" },
          { field: "afterwork", label: "🖋️ Nachbearbeitung (sec)" },
          { field: "businesscase", label: "📈 Geschäftsfallquote (%)" },
          { field: "contactcode", label: "📊 Contact Code (%)" },
        ].map(({ field, label }) => (
          <input
            key={field}
            type="number"
            placeholder={label}
            value={current.sonic[field]}
            onChange={(e) => handleChange("sonic", field, e.target.value)}
          />
        ))}
        <div>Sonic Punkte: {calculateTotal(current.sonic)} {getMedal(calculateTotal(current.sonic))}</div>
      </div>

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

      {achievementUnlocked && (
        <>
          <div
