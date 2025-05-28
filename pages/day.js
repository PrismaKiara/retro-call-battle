
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "retro-call-battle/styles/Day.module.css";

export default function Day() {
  const router = useRouter();
  const [date, setDate] = useState("");

  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setDate(yesterday.toISOString().split("T")[0]);
  }, []);

  return (
    <div className={styles.container}>
      <h1>Eintrag für {date}</h1>
      <form>
        <label>
          Talktime (sek):
          <input type="number" name="talktime" />
        </label>
        <br />
        <label>
          Nachbearbeitung (sek):
          <input type="number" name="aht" />
        </label>
        <br />
        <label>
          Geschäftsfallquote (%):
          <input type="number" name="gq" />
        </label>
        <br />
        <label>
          Contact Code (%):
          <input type="number" name="cc" />
        </label>
        <br />
        <button type="submit">Einreichen</button>
      </form>
      <button onClick={() => router.push("/calendar")}>Zurück zum Kalender</button>
    </div>
  );
}
