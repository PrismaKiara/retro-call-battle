
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Day() {
  const router = useRouter();
  const [date, setDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("de-DE");
    setDate(formatted);
  }, []);

  return (
    <div style={{
      backgroundColor: "#1e1e2f",
      color: "#00ffff",
      fontFamily: "Courier New, monospace",
      padding: "2rem",
      height: "100vh"
    }}>
      <h1 style={{ color: "#ff00ff" }}>🎮 Tagesansicht für {date}</h1>
      <p>Hier kannst du deine heutigen Werte einsehen oder bearbeiten.</p>
      <button
        style={{
          backgroundColor: "#ff00ff",
          color: "white",
          border: "none",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: "pointer",
          marginTop: "1rem"
        }}
        onClick={() => router.push("/calendar")}
      >
        ⬅ Zurück zum Kalender
      </button>
    </div>
  );
}
