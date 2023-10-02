import { useEffect, useState } from "react";

export type CountdownType = [number, number, boolean];

interface CountdownProps {
  seconds: number;
  minutes: number;
}

export function useCountdown(value: CountdownProps): CountdownType {
  const [time, setTime] = useState<CountdownProps>(value);
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

        return { minutes, seconds };
      });
      return () => clearInterval(timerId);
    }, 1000);
  }, []);

  return [time.seconds, time.minutes, done];
}
