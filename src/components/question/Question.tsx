import { NextContext } from "@/src/context/NextContext";
import { Prisma } from "@prisma/client";
import dynamic from "next/dynamic";
import { useContext, useState } from "react";
import { Button } from "../ui/Button";
import { SimpleTimer } from "../SimpleTimer";
import { Text } from "@radix-ui/themes";

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
    invokeSaveAsDialog(blob, `${content}.webm`);
  };

  return (
    <div>
      <div className="grid grid-cols-1 justify-items-center">
        <Text size="8">{content}</Text>
        {!blob && (
          <SimpleTimer
            seconds={Number(result.seconds)}
            minutes={Number(result.minutes)}
            setDone={setDone}
          />
        )}
      </div>
      <div>
        <VideoRecording
          setBlob={setBlob}
          stream={stream}
          setDone={setDone}
          done={done}
        />
        {blob && (
          <div>
            <div className="grid grid-cols-2">
              <Button onClick={() => handleSave(blob)}>Save</Button>
              <Button disabled={!done} onClick={handleNext}>
                {remaining === 0 ? "Finish" : "Next"}
              </Button>
            </div>
            <p>Remaining Questions: {remaining}</p>
          </div>
        )}
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
