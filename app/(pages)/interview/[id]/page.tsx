"use client";

import { QUESTION_ROUTE } from "@/app/api/question/route";
import { Finished } from "@/app/components/Finished";
import { PreInterview } from "@/app/components/PreInterview";
import { Question } from "@/app/components/Question";
import { NextContext } from "@/lib/context";
import { clearVideos } from "@/lib/idb";
import { getUrlWithQueryParams } from "@/lib/utils";
import { useState } from "react";
import useSWR from "swr";

type PageProps = {
  params: { id: string };
};

const validateParam = (params) => {
  if (!("id" in params)) return false;

  const { id } = params;
  if (typeof id != "string") return false;

  return (
    !isNaN(id as any) && // use type coercion
    !isNaN(parseFloat(id)) &&
    Number.isFinite(parseFloat(id))
  );
};

const Page: React.FC<PageProps> = ({ params }) => {
  const [index, setIndex] = useState(0);
  const [start, setStart] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const fetcher = async () => {
    if (!validateParam(params)) throw new Error("Invalid route param");

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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.toString()}</p>;

  if (data.length === 0) return <p>Failed to find data</p>;
  if (index >= data.length) return <Finished />;

  if (!start && index < data.length) {
    return (
      <PreInterview
        content={data[index].content}
        setStart={setStart}
        setStream={setStream}
      />
    );
  }

  if (!stream) return <p>Failed to start recording... please reload page</p>;

  return (
    <>
      <div className="flex h-[calc(100dvh)] items-center">
        {index < data.length && (
          <>
            {start && (
              <div className="container flex flex-col justify-center">
                <NextContext.Provider value={{ handleNext }}>
                  <Question
                    remaining={data.length - index - 1}
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
