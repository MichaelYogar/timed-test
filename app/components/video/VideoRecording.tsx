import React, { useState, useRef, useEffect } from "react";
import { RecordRTCPromisesHandler } from "recordrtc";
import { useErrorBoundary } from "react-error-boundary";
import { addVideo } from "@/lib/idb";

interface VideoProps {
  done: Boolean;
}

export const VideoRecording: React.FC<VideoProps> = ({ done }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [recording, setRecording] = useState(false);

  const recordRTCRef = useRef<RecordRTCPromisesHandler | null>(null);
  const recordingRef = useRef<HTMLVideoElement | null>(null);

  const { showBoundary } = useErrorBoundary();

  const handleRecording = async () => {
    setBlob(null);

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
        .catch((e) => console.log(e));

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
        setRecording(false);
      })
      .catch((e) => console.log(e));
  };

  const handlePause = () => recordRTCRef?.current?.pauseRecording();

  const handleResume = () => recordRTCRef?.current?.resumeRecording();

  useEffect(() => {
    if (recordingRef.current) recordingRef.current.srcObject = stream;
  }, [stream, recordingRef]);

  useEffect(() => {
    if (done) handleStop();
  }, [done]);

  return (
    <div>
      <header>
        {recording ? (
          <button onClick={handleStop}>stop</button>
        ) : (
          <button onClick={handleRecording}>start</button>
        )}
        <button onClick={handlePause}>pause</button>
        <button onClick={handleResume}>resume</button>
        {!blob && recording && (
          <video
            ref={recordingRef}
            muted={true}
            autoPlay={true}
            style={{ width: "100%", height: "auto", outline: "none" }}
          />
        )}
      </header>
    </div>
  );
};