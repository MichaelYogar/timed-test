"use client";

import { CountdownTimer } from "@/components/CountdownTimer";
import { TimeInput } from "@/components/TimeInput";
import { TimeFormValues } from "@/types/TimeForm";
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
  const [time, setTime] = useState<TimeFormValues>({ minutes: 0, seconds: 0 });
  return (
    <div>
      {time.minutes === 0 && time.seconds === 0 ? (
        <div>
          <div>Enter time </div>
          <TimeInput onValueChange={setTime} />
        </div>
      ) : (
        <CountdownTimer minutes={time.minutes} seconds={time.seconds} />
      )}
      <div>{time.minutes}</div>
      <div>{time.seconds}</div>
      <Video />
    </div>
  );
}
