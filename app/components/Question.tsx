import { CountdownTimer } from "@/app/components/CountdownTimer";
import { Button } from "@/components/ui/button";
import { NextContext } from "@/lib/context";
import { Prisma } from "@prisma/client";
import dynamic from "next/dynamic";
import { useContext, useState } from "react";

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
  | Prisma.QuestionCreateInput & {
      stream: MediaStream | null;
      remaining: number;
    };

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
        <div>
          <h1>{content}</h1>
          <Button variant="outline" disabled={!done} onClick={handleNext}>
            {remaining === 0 ? "Finished" : "Done"}
          </Button>
          <Button variant="outline" onClick={() => handleSave(blob)}>
            Save Video
          </Button>
          <div className="flex justify-center">
            Remaining Questions: {remaining}
          </div>
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
