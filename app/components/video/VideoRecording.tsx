import React, { useState, useRef, useEffect } from "react";
import { RecordRTCPromisesHandler, invokeSaveAsDialog } from "recordrtc";
import { useErrorBoundary } from "react-error-boundary";
import { addVideo } from "@/lib/idb";

interface VideoProps {
  done: Boolean;
  setDone(value: boolean): void;
}

export const VideoRecording: React.FC<VideoProps> = ({ done, setDone }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);

  const [stop, setStop] = useState(false);
  const [recording, setRecording] = useState(false);

  const recordRTCRef = useRef<RecordRTCPromisesHandler | null>(null);
  const recordingRef = useRef<HTMLVideoElement | null>(null);

  const { showBoundary } = useErrorBoundary();

  const startRecording = async () => {
    let cameraStream = null;

    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: {
          // TODO: mobile should have support for back camera
          facingMode: "user",
        },
        audio: {
          echoCancellation: true,
        },
      });
    } catch (e) {
      if (e.name === "NotAllowedError") {
        alert(
          "Permission denied. Cannot access audio/video. Please reload page!"
        );
      }
      showBoundary(e);
    }

    if (cameraStream) {
      setStream(cameraStream);

      recordRTCRef.current = new RecordRTCPromisesHandler(cameraStream, {
        type: "video",
      });

      recordRTCRef
        .current!.startRecording()
        .then(() => console.log("success"))
        .catch((e) => alert(e));

      setRecording(true);
    }
  };

  const handleStop = () => {
    recordRTCRef?.current
      ?.stopRecording()
      .then(async () => {
        const currentBlob = await recordRTCRef!.current!.getBlob();
        await addVideo(currentBlob);
        setBlob(currentBlob);

        setStream(null);
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
            {recording && <button onClick={handleStop}>stop</button>}
            <video
              ref={recordingRef}
              muted={true}
              autoPlay={true}
              style={{ width: "100%", height: "auto", outline: "none" }}
            />
          </>
        )}
        {blob && (
          <button onClick={() => invokeSaveAsDialog(blob)}>Save Video</button>
        )}
      </header>
    </div>
  );
};
