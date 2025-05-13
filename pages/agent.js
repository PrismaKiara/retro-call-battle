
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function AgentDashboard() {
  const [talktime, setTalktime] = useState("");
  const [aht, setAht] = useState("");
  const [businesscase, setBusinesscase] = useState("");
  const [contactCode, setContactCode] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from("entries").insert([
      {
        talktime: Number(talktime),
        aht: Number(aht),
        businesscase: Number(businesscase),
        contact_code: Number(contactCode),
        date: new Date().toISOString().split("T")[0],
      },
    ]);
    if (!error) {
      alert("Eintrag gespeichert!");
      setTalktime(""); setAht(""); setBusinesscase(""); setContactCode("");
    } else {
      alert("Fehler beim Speichern.");
    }
  };

  return (
    <div style={{ backgroundColor: '#1e1e2f', color: '#00ffff', padding: '2rem', fontFamily: 'Courier New' }}>
      <h1 style={{ color: '#ff00ff' }}>Agent Dashboard</h1>
      <p>Hier kannst du deine täglichen Werte eintragen.</p>
      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <div>
          <label>Talktime (sec):</label>
          <input value={talktime} onChange={e => setTalktime(e.target.value)} required type="number" style={{ display: 'block', marginBottom: '1rem' }} />
        </div>
        <div>
          <label>AHT (sec):</label>
          <input value={aht} onChange={e => setAht(e.target.value)} required type="number" style={{ display: 'block', marginBottom: '1rem' }} />
        </div>
        <div>
          <label>Geschäftsfallquote (%):</label>
          <input value={businesscase} onChange={e => setBusinesscase(e.target.value)} required type="number" style={{ display: 'block', marginBottom: '1rem' }} />
        </div>
        <div>
          <label>Contact Code (%):</label>
          <input value={contactCode} onChange={e => setContactCode(e.target.value)} required type="number" style={{ display: 'block', marginBottom: '1rem' }} />
        </div>
        <button type="submit" style={{ backgroundColor: '#ff00ff', color: 'white', padding: '0.5rem 1rem' }}>Speichern</button>
      </form>
    </div>
  );
}
