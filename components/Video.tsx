import React, { useState, useRef, useEffect } from "react";
import RecordRTC, { invokeSaveAsDialog } from "recordrtc";

interface VideoProps {
  done: Boolean;
}

export const Video: React.FC<VideoProps> = ({ done }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [recording, setRecording] = useState(false);

  const recordRTCRef = useRef<RecordRTC | null>(null);
  const replayRef = useRef<HTMLVideoElement | null>(null);
  const recordingRef = useRef<HTMLVideoElement | null>(null);

  const handleRecording = async () => {
    setBlob(null);

    const cameraStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: {
        echoCancellation: true,
      },
    });

    setStream(cameraStream);
    recordRTCRef.current = new RecordRTC(cameraStream, {
      type: "video",
    });
    recordRTCRef.current!.startRecording();
    setRecording(true);
  };

  const handleStop = () => {
    recordRTCRef?.current?.stopRecording(() => {
      setBlob(recordRTCRef!.current!.getBlob());
      setStream(null);
      setRecording(false);
    });
  };

  const handlePause = () => recordRTCRef?.current?.pauseRecording();

  const handleResume = () => recordRTCRef?.current?.resumeRecording();

  const handleSave = () => blob && invokeSaveAsDialog(blob);

  useEffect(() => {
    if (blob) {
      const blobSrc = URL.createObjectURL(blob);
      replayRef!.current!.src = blobSrc;
    }
  }, [blob]);

  useEffect(() => {
    if (recordingRef.current) recordingRef.current.srcObject = stream;
  }, [stream, recordingRef]);

  useEffect(() => {
    if (done === true) {
      handleStop();
      alert("called handle stop");
    } else {
      console.log(done);
    }
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
        <button onClick={handleSave}>save</button>
        {blob && (
          <video
            autoPlay={true}
            controls
            ref={replayRef}
            style={{ width: "800", margin: "1em" }}
          />
        )}
        {!blob && recording && (
          <video
            controls
            autoPlay
            ref={recordingRef}
            muted={true}
            style={{ width: "800px", margin: "1em" }}
          />
        )}
      </header>
    </div>
  );
};
