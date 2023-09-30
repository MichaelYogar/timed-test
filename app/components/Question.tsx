import { CountdownTimer } from "@/app/components/CountdownTimer";
import { Prisma } from "@prisma/client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

const VideoRecording = dynamic(
  () =>
    import("./video/VideoRecording").then((mod) => {
      return mod.VideoRecording;
    }),
  {
    ssr: false,
  }
);

type QuestionProps = Prisma.QuestionCreateInput & {
  setQuestionDone(value: boolean): void;
};

export const Question: React.FC<QuestionProps> = ({
  content,
  duration,
  setQuestionDone,
}) => {
  const [done, setDone] = useState<boolean>(false);
  const result = parseDuration(duration);

  useEffect(() => {
    if (done) setQuestionDone(done);
  }, [done]);

  return (
    <div>
      <h1>{content}</h1>
      <CountdownTimer
        seconds={Number(result.seconds)}
        minutes={Number(result.minutes)}
        setDone={setDone}
      />
      <ErrorBoundary fallback={<div>Failed to record video</div>}>
        <VideoRecording done={done} />
      </ErrorBoundary>
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
