import { useEffect, useState } from "react";

export function useCountdown(target: Date): number[] {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [days, setDays] = useState(0);

  useEffect(() => {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const MS_PER_HOUR = 1000 * 60 * 60;
    const MS_PER_MINUTE = 1000 * 60;
    const MS_PER_SECOND = 1000;

    const interval = setInterval(() => {
      const now = new Date();
      const differnce = target.getTime() - now.getTime();

      const daysDiff = Math.floor(differnce / MS_PER_DAY);
      const hourDiff = Math.floor((differnce % MS_PER_DAY) / MS_PER_HOUR);
      const minuteDiff = Math.floor((differnce % MS_PER_HOUR) / MS_PER_MINUTE);
      const secondsdiff = Math.floor(
        (differnce % MS_PER_MINUTE) / MS_PER_SECOND
      );

      setDays(daysDiff);
      setHours(hourDiff);
      setMinutes(minuteDiff);
      setSeconds(secondsdiff);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, minutes, hours, days]);

  return [seconds, minutes, hours, days];
}
