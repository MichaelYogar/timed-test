import { useCountdown } from "@/app/hooks/useCountdown";
import { FC, useEffect } from "react";

export const CountdownTimer: FC<CountdownTimerProps> = ({
  setDone,
  ...props
}) => {
  const [seconds, minutes, done] = useCountdown(props);

  useEffect(() => {
    if (done === true) {
      setDone(done);
    }
  }, [done, setDone]);

  return (
    <div className="container flex justify-center">
      <div className="p-4 w-36 h-36 rounded-full border-2 border-black flex justify-center items-center flex-col">
        <h1>{minutes <= -1 ? <span>-</span> : <div>minutes {minutes}</div>}</h1>
        <h1>{seconds <= -1 ? <span>-</span> : <div>seconds {seconds}</div>}</h1>
      </div>
    </div>
  );
};
