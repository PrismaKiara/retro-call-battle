
import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, isBefore, isAfter } from 'date-fns';
import { useRouter } from 'next/router';


const CalendarPage = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const startDate = new Date();
  const endDate = addDays(startDate, 29);

  const handleNextDay = () => {
    const nextDay = addDays(currentDate, 1);
    if (!isAfter(nextDay, endDate)) {
      setCurrentDate(nextDay);
    }
  };

  const handlePreviousDay = () => {
    const prevDay = subDays(currentDate, 1);
    if (!isBefore(prevDay, startDate)) {
      setCurrentDate(prevDay);
    }
  };

  const handleGoBack = () => {
    router.push('/agent');
  };

  return (
    <div className="retro-container">
      <h1 className="retro-title">📅 Retro Tagesübersicht</h1>
      <div className="retro-box">
        <p>📆 Aktueller Tag: <strong>{format(currentDate, 'dd.MM.yyyy')}</strong></p>
        <div className="button-row">
          <button className="retro-button" onClick={handlePreviousDay}>⬅️ Zurück</button>
          <button className="retro-button" onClick={handleNextDay}>Weiter ➡️</button>
        </div>
        <button className="retro-button back-button" onClick={handleGoBack}>🔙 Zur Übersicht</button>
      </div>
    </div>
  );
};

export default CalendarPage;
