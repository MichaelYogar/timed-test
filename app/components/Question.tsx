import { CountdownTimer } from "@/app/components/CountdownTimer";
import { Prisma } from "@prisma/client";
import dynamic from "next/dynamic";
import { useState } from "react";

const VideoRecording = dynamic(
  () =>
    import("./video/VideoRecording").then((mod) => {
      return mod.VideoRecording;
    }),
  {
    ssr: false,
  }
);

type QuestionProps =
  | Prisma.QuestionCreateInput & { stream: MediaStream | null };

export const Question: React.FC<QuestionProps> = ({
  content,
  duration,
  stream,
}) => {
  const [done, setDone] = useState<boolean>(false);
  const result = parseDuration(duration);

  return (
    <div>
      {!done && (
        <div className="mb-4">
          <CountdownTimer
            seconds={Number(result.seconds)}
            minutes={Number(result.minutes)}
            setDone={setDone}
          />
        </div>
      )}
      <div className="container flex justify-center">
        <VideoRecording
          stream={stream}
          content={content}
          setDone={setDone}
          done={done}
        />
      </div>
    </div>
  );
};

function parseDuration(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return {
    minutes: minutes,
    seconds: seconds,
  };
}
