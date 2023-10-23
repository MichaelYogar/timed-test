"use client";

import { Finished } from "@/src/components/Finished";
import { QuestionPreview } from "@/src/components/question/QuestionPreview";
import { Question } from "@/src/components/question/Question";
import { NextContext } from "@/src/context/NextContext";
import { clearVideos } from "@/src/lib/idb";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { QUESTION_ROUTE } from "@/src/lib/routes";
import NextError from "next/error";
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
  const [preview, setPreview] = useState(true);

  useEffect(() => {
    if (preview && start) setPreview(false);
  }, [start, preview]);

  const fetcher = async () => {
    if (!validateParam(params)) throw new Error("Invalid route param");

    const value = window.localStorage.getItem("asdf");

    if (!!value) {
      const result: any[] = JSON.parse(value);
      const id = Number(params.id);
      return result[id].questions;
    }

    return undefined;
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

  if (error)
    return <NextError statusCode={error.status ? error.status : 400} />;

  if (isLoading || !questions) return <></>;

  if (questions.length > 0 && index >= questions.length) return <Finished />;

  if (preview) {
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
        <NextContext.Provider value={{ handleNext }}>
          <Question
            key={index}
            remaining={questions.length - index - 1}
            stream={stream}
            content={questions[index].content}
            duration={questions[index].duration}
          />
        </NextContext.Provider>
      )}
    </div>
  );
};

export default Page;
