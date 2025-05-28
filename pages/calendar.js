// pages/calendar.js
import React from "react";
import { useRouter } from "next/router";
import styles from "../styles/Calendar.module.css";
import { format } from "date-fns";

export default function Calendar() {
  const router = useRouter();

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // Zeitraum: Letzte 30 Tage vor heute
  const startDate = new Date();
  startDate.setDate(today.getDate() -1);

  const days = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push(date);
  }

  const handleDayClick = (date) => {
    const isYesterday =
      date.toDateString() === yesterday.toDateString();

    if (isYesterday) {
      router.push(`/day?date=${date.toISOString().split("T")[0]}`);
    } else {
      alert("Du kannst nur den gestrigen Tag bearbeiten.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📅 Retro Tagesübersicht</h1>
      <p className={styles.subtitle}>
        Zeigt die letzten 30 Tage bis gestern – nur gestern ist bearbeitbar.
      </p>
      <div className={styles.grid}>
        {days.map((date) => {
          const dateStr = format(date, "dd.MM.yyyy");
          const isYesterday =
            date.toDateString() === yesterday.toDateString();

          return (
            <button
              key={dateStr}
              className={`${styles.dayButton} ${
                isYesterday ? styles.active : styles.disabled
              }`}
              onClick={() => handleDayClick(date)}
              disabled={!isYesterday}
            >
              {dateStr}
            </button>
          );
        })}
      </div>
    </div>
  );
}
