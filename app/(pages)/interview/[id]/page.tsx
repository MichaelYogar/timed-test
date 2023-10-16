"use client";

import { QUESTION_ROUTE } from "@/app/api/question/route";
import { CountdownTimer } from "@/app/components/CountdownTimer";
import { Question } from "@/app/components/Question";
import { NextContext } from "@/lib/context";
import { clearVideos } from "@/lib/idb";
import { getUrlWithQueryParams } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

const Page = ({ params }) => {
  const [index, setIndex] = useState(0);
  const [start, setStart] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const router = useRouter();

  const fetcher = async () => {
    const result = await fetch(
      getUrlWithQueryParams(QUESTION_ROUTE, { id: params.id }),
      { method: "GET" }
    );
    return await result.json();
  };

  const { data, error, isLoading } = useSWR(QUESTION_ROUTE, fetcher);

  const handleNext = async () => {
    setIndex((prevIndex) => prevIndex + 1);
    setStart(false);
    await clearVideos();
  };

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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.toString()}</p>;
  if (data && index >= data.length) router.push("/result");

  if (!start && index < data.length) {
    return (
      <div className="container flex h-screen flex-col gap-4">
        <div className="m-auto">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {data[index].content}
          </h1>
          <CountdownTimer setDone={setStart} seconds={10} minutes={0} />
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="flex h-[calc(100dvh)] items-center">
        {index < data.length && (
          <>
            {start && (
              <div className="container flex flex-col justify-center">
                <NextContext.Provider value={{ handleNext }}>
                  <Question
                    stream={stream}
                    key={index}
                    content={data[index].content}
                    duration={data[index].duration}
                  />
                </NextContext.Provider>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Page;
