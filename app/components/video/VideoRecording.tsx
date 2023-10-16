import React, { useState, useRef, useEffect, useContext } from "react";
import { RecordRTCPromisesHandler, invokeSaveAsDialog } from "recordrtc";
import { addVideo } from "@/lib/idb";
import { NextContext } from "@/lib/context";
import { Button } from "@/components/ui/button";

interface VideoProps {
  content: string;
  done: Boolean;
  setDone(value: boolean): void;
  stream: MediaStream | null;
}

export const VideoRecording: React.FC<VideoProps> = ({
  content,
  done,
  setDone,
  stream,
}) => {
  const [blob, setBlob] = useState<Blob | null>(null);

  const [stop, setStop] = useState(false);
  const [recording, setRecording] = useState(false);

  const recordRTCRef = useRef<RecordRTCPromisesHandler | null>(null);
  const recordingRef = useRef<HTMLVideoElement | null>(null);

  const { handleNext } = useContext(NextContext);

  const startRecording = async () => {
    if (stream) {
      recordRTCRef.current = new RecordRTCPromisesHandler(stream, {
        type: "video",
      });

      recordRTCRef
        .current!.startRecording()
        .then(() => console.log("success"))
        .catch((e) => alert(e));

      setRecording(true);
    } else {
      alert("Failed to start recording");
    }
  };

  const handleStop = () => {
    recordRTCRef?.current
      ?.stopRecording()
      .then(async () => {
        const currentBlob = await recordRTCRef!.current!.getBlob();
        await addVideo(currentBlob);
        setBlob(currentBlob);

        setDone(true);
        setStop(true);
        setRecording(false);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (recordingRef.current) recordingRef.current.srcObject = stream;
  }, [stream, recordingRef]);

  useEffect(() => {
    // Time ran out instead of manually stopping
    if (done && !stop) handleStop();
  }, [done]);

  if (!recording && !stop) startRecording();

  return (
    <div>
      <header>
        {!stop && (
          <>
            <video
              ref={recordingRef}
              muted={true}
              autoPlay={true}
              style={{ width: "100%", height: "auto", outline: "none" }}
            />
          </>
        )}
        <div style={{ float: "right" }}>
          {recording && <Button onClick={handleStop}>stop</Button>}
        </div>
        {blob && (
          <div>
            <h1>{content}</h1>
            <Button variant="link" disabled={!done} onClick={handleNext}>
              Next
            </Button>
            <Button variant="outline" onClick={() => invokeSaveAsDialog(blob)}>
              Save Video
            </Button>
          </div>
        )}
      </header>
    </div>
  );
};
