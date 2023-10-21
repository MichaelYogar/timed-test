import { useEffect } from "react";
import { CountdownTimer } from "../CountdownTimer";
import { PREVIEW_SECONDS } from "@/src/lib/constants";

type PreInterviewProps = {
  setStart(start: boolean): void;
  setStream(stream: MediaStream): void;
  content: string;
};
export const QuestionPreview: React.FC<PreInterviewProps> = ({
  content,
  setStream,
  setStart,
}) => {
  useEffect(() => {
    const getStream = async () => {
      try {
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: {
            // TODO: mobile should have support for back camera
            facingMode: "user",
          },
          audio: {
            echoCancellation: true,
          },
        });

        setStream(cameraStream);
      } catch (e) {
        if (e instanceof Error) {
          if (e.name === "NotAllowedError") {
            alert("Permission denied. Cannot access audio/video!");
          }
        }
      }
    };

    getStream();
  }, []);

  return (
    <div className="container h-screen flex flex-col justify-center">
      <div>
        <h1 className="text-4xl font-extrabold lg:text-5xl text-center mb-[4rem]">
          Starting...
        </h1>
      </div>
      <div>
        <CountdownTimer
          preview={true}
          setDone={setStart}
          seconds={PREVIEW_SECONDS}
          minutes={0}
        />
      </div>
    </div>
  );
};
