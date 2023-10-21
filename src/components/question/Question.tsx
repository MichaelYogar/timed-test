import { CountdownTimer } from "@/src/components/CountdownTimer";
import { NextContext } from "@/src/lib/context";
import { Prisma } from "@prisma/client";
import dynamic from "next/dynamic";
import { useContext, useState } from "react";
import { Button } from "../ui/Button";

const VideoRecording = dynamic(
  () =>
    import("../video/VideoRecording").then((mod) => {
      return mod.VideoRecording;
    }),
  {
    ssr: false,
  }
);

type Props =
  | Prisma.QuestionCreateInput & {
      stream: MediaStream | null;
      remaining: number;
    };

type QuestionProps = Omit<Props, "Interview">;

export const Question: React.FC<QuestionProps> = ({
  content,
  duration,
  stream,
  remaining,
}) => {
  const [blob, setBlob] = useState<Blob | null>(null);
  // Either timer runs out or they manually press stop buttion
  const [done, setDone] = useState(false);
  const { handleNext } = useContext(NextContext);

  const result = parseDuration(duration);

  const handleSave = async (blob: Blob) => {
    const { invokeSaveAsDialog } = (await import("recordrtc")).default;
    invokeSaveAsDialog(blob);
  };

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
          setBlob={setBlob}
          stream={stream}
          setDone={setDone}
          done={done}
        />
      </div>
      {blob && (
        <div className="flex flex-col items-center">
          <h1>Question: {content}</h1>
          <div className="flex space-between">
            <div>
              <Button onClick={() => handleSave(blob)}>Save</Button>
            </div>
            <Button disabled={!done} onClick={handleNext}>
              {remaining === 0 ? "Finish" : "Next"}
            </Button>
          </div>
          <p>Remaining Questions: {remaining}</p>
        </div>
      )}
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
