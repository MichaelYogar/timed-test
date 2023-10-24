import React, { useState, useRef, useEffect, useContext } from "react";
import RecordRTC, { RecordRTCPromisesHandler } from "recordrtc";
import { addVideo } from "@/src/lib/idb";
import { Button } from "../ui/Button";

interface VideoProps {
  done: Boolean;
  setDone(value: boolean): void;
  setBlob(blob: Blob | null): void;
  stream: MediaStream | null;
}

export const VideoRecording: React.FC<VideoProps> = ({
  done,
  setDone,
  setBlob,
  stream,
}) => {
  const [recording, setRecording] = useState(false);

  const recordRTCRef = useRef<RecordRTCPromisesHandler | null>(null);
  const recordingRef = useRef<HTMLVideoElement | null>(null);

  const startRecording = async () => {
    if (stream) {
      recordRTCRef.current = new RecordRTCPromisesHandler(stream, {
        // TODO: find out why MediaRecorder.isTypeSupported(video/webm;codecs=vp8) return true but doesnt work on firefox
        mimeType: "video/webm",
        type: "video",
        disableLogs: true,
      });

      recordRTCRef.current!.startRecording().then(() => console.log("success"));

      setRecording(true);
      setBlob(null);
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
        setRecording(false);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (recordingRef.current) recordingRef.current.srcObject = stream;
  }, [stream, recordingRef]);

  useEffect(() => {
    // Time ran out instead of manually stopping
    if (done) handleStop();
  }, [done]);

  if (!recording && !done) startRecording();

  return (
    <div>
      <header>
        {!done && (
          <>
            <video
              ref={recordingRef}
              muted={true}
              autoPlay={true}
              style={{ width: "100%", height: "auto", outline: "none" }}
            />
          </>
        )}
        <div style={{ float: "right", marginTop: "4px" }}>
          {recording && <Button onClick={handleStop}>stop</Button>}
        </div>
      </header>
    </div>
  );
};
