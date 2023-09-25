import { useEffect, useState } from "react";

export type CountDownType = [number, number, boolean];

export function useCountdown(value: CountdownTimerProps): CountDownType {
  const [time, setTime] = useState<CountdownTimerProps>(value);
  const [done, setDone] = useState<boolean>(false);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime((prevTime) => {
        let { minutes, seconds } = prevTime;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else {
          clearInterval(timerId);
          setDone(true);
          return prevTime; // return the same state to prevent unnecessary re-renders
        }

        console.log(seconds);
        return { minutes, seconds };
      });
      return () => clearInterval(timerId); // Clear the interval when the component is unmounted
    }, 1000);
  }, []);

  return [time.seconds, time.minutes, done];
}

const getDiff = (dateDiffInMS: number) => {
  const MS_PER_HOUR = 1000 * 60 * 60;
  const MS_PER_MINUTE = 1000 * 60;
  const MS_PER_SECOND = 1000;

  const minutesDiff = Math.floor((dateDiffInMS % MS_PER_HOUR) / MS_PER_MINUTE);
  const secondsDiff = Math.floor(
    (dateDiffInMS % MS_PER_MINUTE) / MS_PER_SECOND
  );

  return [minutesDiff, secondsDiff];
};
