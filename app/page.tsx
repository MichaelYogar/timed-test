"use client";

import { CountdownTimer } from "@/components/CountdownTimer";
import { TimeInput } from "@/components/TimeInput";
import dynamic from "next/dynamic";
import { useState } from "react";

const Video = dynamic(
  () =>
    import("../components/Video").then((mod) => {
      return mod.Video;
    }),
  {
    ssr: false,
  }
);

export default function Home() {
  const [countdownTime, setCountdownTime] = useState<CountdownTimerProps>({
    minutes: 0,
    seconds: 0,
  });
  const [done, setDone] = useState<boolean>(false);

  return (
    <div>
      {Number(countdownTime.minutes) === 0 &&
      Number(countdownTime.seconds) === 0 ? (
        <div>
          <h1>------------</h1>
          <TimeInput onValueChange={setCountdownTime} />
          <h1>------------</h1>
        </div>
      ) : (
        <div>
          <CountdownTimer
            minutes={countdownTime.minutes}
            seconds={countdownTime.seconds}
            setDone={setDone}
          />
        </div>
      )}
      <Video done={done} />
    </div>
  );
}
