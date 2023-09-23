import { useCountdown } from "@/hooks/useCountdown";
import { TimeFormValues } from "@/types/TimeForm";
import { FC } from "react";

export const CountdownTimer: FC<TimeFormValues> = (props) => {
  const [seconds, minutes] = useCountdown(props);

  return (
    <div>
      <div>
        <h1>{minutes <= -1 ? <span>-</span> : <div>minutes {minutes}</div>}</h1>
        <h1>{seconds <= -1 ? <span>-</span> : <div>seconds {seconds}</div>}</h1>
      </div>
    </div>
  );
};
