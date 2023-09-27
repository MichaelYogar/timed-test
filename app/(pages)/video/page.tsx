"use client";
import { CountdownTimer } from "@/components/CountdownTimer";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Video = dynamic(
  () =>
    import("../../../components/Video").then((mod) => {
      return mod.Video;
    }),
  {
    ssr: false,
  }
);

const Page = () => {
  const searchParams = useSearchParams();
  const [done, setDone] = useState<boolean>(false);

  return (
    <div>
      <CountdownTimer
        minutes={Number(searchParams.get("minutes"))}
        seconds={Number(searchParams.get("seconds"))}
        setDone={setDone}
      />
      <ErrorBoundary fallback={<div>Failed to record video</div>}>
        <Video done={done} />
      </ErrorBoundary>
    </div>
  );
};

export default Page;
