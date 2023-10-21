"use client";

import { Finished } from "@/src/components/Finished";
import { QuestionPreview } from "@/src/components/question/QuestionPreview";
import { Question } from "@/src/components/question/Question";
import { NextContext } from "@/src/context/NextContext";
import { clearVideos } from "@/src/lib/idb";
import { getUrlWithQueryParams } from "@/src/lib/utils";
import { useState } from "react";
import useSWR from "swr";
import { QUESTION_ROUTE } from "@/src/lib/routes";
import Error from "next/error";

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

  if (data.length > 0 && index >= data.length) return <Finished />;

  if (data.length === 0) {
    return <Error statusCode={400} />;
  }

  if (!start && index < data.length) {
    return (
      <QuestionPreview
        content={data[index].content}
        setStart={setStart}
        setStream={setStream}
      />
    );
  }

  if (!stream) {
    alert("Failed to start recording... please reload page!");
    window.location.reload();
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
