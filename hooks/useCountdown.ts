import { TimeFormValues } from "@/types/TimeForm";
import { useEffect, useState } from "react";

export function useCountdown(value: TimeFormValues): number[] {
  const [time, setTime] = useState<TimeFormValues>(value);

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
          return prevTime; // return the same state to prevent unnecessary re-renders
        }

        console.log(seconds);
        return { minutes, seconds };
      });
      return () => clearInterval(timerId); // Clear the interval when the component is unmounted
    }, 1000);
  }, []);

  return [time.seconds, time.minutes];
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
