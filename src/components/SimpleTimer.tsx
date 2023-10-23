import { useCountdown } from "@/src/hooks/useCountdown";
import { Text } from "@radix-ui/themes";
import { FC, useEffect } from "react";

interface SimpleTimerProps {
  minutes: number;
  seconds: number;
  setDone?(flag: boolean): void;
}

export const SimpleTimer: FC<SimpleTimerProps> = ({ setDone, ...props }) => {
  const [seconds, minutes, done] = useCountdown(props);

  const formatSeconds = (digit: number) =>
    digit > 0 && digit < 10 ? `0${digit}` : digit;

  useEffect(() => {
    // setDone is for any component that needs to know that the timer is over
    if (done === true && setDone) {
      setDone(done);
    }
  }, [done, setDone]);

  return (
    <Text size="4">
      {minutes > 0 ? `${minutes}:` : "0:"}
      {seconds > 0 ? formatSeconds(seconds) : "00"}
    </Text>
  );
};
