"use client";

import { Finished } from "@/src/components/Finished";
import { QuestionPreview } from "@/src/components/question/QuestionPreview";
import { Question } from "@/src/components/question/Question";
import { NextContext } from "@/src/context/NextContext";
import { clearVideos } from "@/src/lib/idb";
import { getUrlWithQueryParams as createUrlWithQueryParams } from "@/src/lib/utils";
import { useState } from "react";
import useSWR from "swr";
import { QUESTION_ROUTE } from "@/src/lib/routes";
import NextError from "next/error";
import { useSession } from "next-auth/react";
import { StatusError } from "@/src/lib/StatusError";

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
  const session = useSession();

  const fetcher = async () => {
    if (!validateParam(params)) throw new Error("Invalid route param");

    const url = createUrlWithQueryParams(QUESTION_ROUTE, {
      id: params.id,
      auth: session && session.status === "authenticated",
    });

    try {
      const result = await fetch(url, { method: "GET" });

      if (result.status !== 200) throw new Error();

      const json = await result.json();
      return json;
    } catch (e) {
      if (e instanceof Error) {
        const error = new StatusError();
        error.status = 400;
        throw error;
      }
    }
  };

  const {
    data: questions,
    error,
    isLoading,
  } = useSWR<any, StatusError>(QUESTION_ROUTE, fetcher);

  const handleNext = async () => {
    setIndex((prevIndex) => prevIndex + 1);
    setStart(false);
    await clearVideos();
  };

  if (error) {
    return <NextError statusCode={error.status ? error.status : 400} />;
  }

  if (isLoading || !questions) return <></>;

  if (questions.length > 0 && index >= questions.length) return <Finished />;

  if (!start && index < questions.length) {
    return (
      <QuestionPreview
        content={questions[index].content}
        setStart={setStart}
        setStream={setStream}
      />
    );
  }

  if (!stream) {
    alert("Failed to start recording...");
    return <></>;
  }

  return (
    <div className="h-[calc(100dvh)]">
      {index < questions.length && (
        <>
          {start && (
            <NextContext.Provider value={{ handleNext }}>
              <Question
                remaining={questions.length - index - 1}
                stream={stream}
                key={index}
                content={questions[index].content}
                duration={questions[index].duration}
              />
            </NextContext.Provider>
          )}
        </>
      )}
    </div>
  );
};

export default Page;
