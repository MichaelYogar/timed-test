import { useEffect } from "react";
import { CountdownTimer } from "../CountdownTimer";

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
        if (e.name === "NotAllowedError") {
          alert(
            "Permission denied. Cannot access audio/video. Please reload page!"
          );
        }
      }
    };

    getStream();
  }, []);

  return (
    <div>
      <div className="container flex h-screen flex-col gap-4 items-center">
        <div className="m-auto">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
            Question: {content}
          </h1>
          <CountdownTimer setDone={setStart} seconds={0} minutes={5} />
        </div>
      </div>
    </div>
  );
};