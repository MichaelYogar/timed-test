import { useCountdown } from "@/src/hooks/useCountdown";
import { FC, useEffect } from "react";

interface CountdownTimerProps {
  minutes: number;
  seconds: number;
  setDone?(flag: boolean): void;
}

type CountdownTimerExtendedProps = CountdownTimerProps & {
  preview?: boolean;
};

export const CountdownTimer: FC<CountdownTimerExtendedProps> = ({
  setDone,
  preview,
  ...props
}) => {
  const [seconds, minutes, done] = useCountdown(props);

  useEffect(() => {
    // setDone is for any component that needs to know that the timer is over
    if (done === true && setDone) {
      setDone(done);
    }
  }, [done, setDone]);

  return (
    <div className="container flex justify-center mt-6">
      <div
        className={`${
          preview ? "animate-bounce" : ""
        } p-4 w-36 h-36 rounded-full border-2 border-black flex justify-center items-center flex-col`}
      >
        {!preview && (
          <h1>
            {minutes <= -1 ? <span>-</span> : <div>minutes: {minutes}</div>}
          </h1>
        )}
        <h1>
          {seconds <= -1 ? (
            <span>-</span>
          ) : (
            <div>
              {!preview && "seconds:"}
              {seconds}
            </div>
          )}
        </h1>
      </div>
    </div>
  );
};
