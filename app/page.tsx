"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [outOfTime, setOutOfTime] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [days, setDays] = useState(0);

  useEffect(() => {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const MS_PER_HOUR = 1000 * 60 * 60;
    const MS_PER_MINUTE = 1000 * 60;
    const MS_PER_SECOND = 1000;

    const target = new Date("09/22/2023 11:33:30");

    const interval = setInterval(() => {
      const now = new Date();
      const differnce = target.getTime() - now.getTime();

      const daysDiff = Math.floor(differnce / MS_PER_DAY);
      const hourDiff = Math.floor((differnce % MS_PER_DAY) / MS_PER_HOUR);
      const minuteDiff = Math.floor((differnce % MS_PER_HOUR) / MS_PER_MINUTE);
      const secondsdiff = Math.floor(
        (differnce % MS_PER_MINUTE) / MS_PER_SECOND
      );

      if (isOutOfTime(daysDiff, hourDiff, minuteDiff, secondsdiff))
        setOutOfTime(true);
      else {
        setDays(daysDiff);
        setHours(hourDiff);
        setMinutes(minuteDiff);
        setSeconds(secondsdiff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [days, hours, minutes, seconds]);

  return (
    <div>
      {!outOfTime ? (
        <div>
          <h1>Days {days}</h1>
          <h1>Hour {hours}</h1>
          <h1>Minute {minutes}</h1>
          <h1>Seconds {seconds}</h1>
        </div>
      ) : (
        <div> End of time</div>
      )}
    </div>
  );
}

const isOutOfTime = (
  daysDiff: number,
  hourDiff: number,
  minuteDiff: number,
  secondsDiff: number
) => daysDiff <= 0 && hourDiff <= 0 && minuteDiff <= 0 && secondsDiff <= 0;
