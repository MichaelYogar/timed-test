import { VideoHTMLAttributes, useCallback } from "react";

type VideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: Blob;
};

export const VideoDisplay = ({ srcObject, ...props }: VideoProps) => {
  const refVideo = useCallback(
    (node: HTMLVideoElement) => {
      if (node) node.src = URL.createObjectURL(srcObject);
    },
    [srcObject]
  );

  return <video ref={refVideo} {...props} />;
};
