// pages/calendar.js
import React from "react";
import { useRouter } from "next/router";
import styles from "../styles/Calendar.module.css";
import { format, subDays, addDays } from "date-fns";

const Calendar = () => {
  const router = useRouter();

  const today = new Date();
  const startDate = subDays(today, 29); // 30 Tage inkl. gestern

  const days = Array.from({ length: 30 }, (_, i) => addDays(startDate, i));

  const goToDay = (date) => {
    router.push(`/day?date=${format(date, "yyyy-MM-dd")}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🗓️ Retro Tagesübersicht</h1>
      <p className={styles.subtitle}>
        Wähle einen Tag, um Daten einzugeben oder anzusehen:
      </p>
      <div className={styles.grid}>
        {days.map((day) => (
          <button
            key={day}
            className={styles.dayButton}
            onClick={() => goToDay(day)}
          >
            {format(day, "dd.MM.")}<br />
            {format(day, "EEEE", { locale: undefined })}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
