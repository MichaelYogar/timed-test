"use client";

import { QUESTION_ROUTE } from "@/app/api/question/route";
import { CountdownTimer } from "@/app/components/CountdownTimer";
import { Question } from "@/app/components/Question";
import { clearVideos } from "@/lib/idb";
import { getUrlWithQueryParams } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

const Page = ({ params }) => {
  const [index, setIndex] = useState(0);
  const [start, setStart] = useState(false);
  const [questionDone, setQuestionDone] = useState(false);
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
    setQuestionDone(false);
    await clearVideos();
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.toString()}</p>;
  if (data && index >= data.length) router.push("/result");

  if (!start && index < data.length) {
    return (
      <>
        <h1>{data[index].content}</h1>
        <CountdownTimer setDone={setStart} seconds={10} minutes={0} />
      </>
    );
  }
  return (
    <>
      <div>
        {index < data.length && (
          <>
            {start ? (
              <Question
                key={index}
                content={data[index].content}
                duration={data[index].duration}
                setQuestionDone={setQuestionDone}
              />
            ) : (
              <>
                <h1>{data[index].content}</h1>
                <CountdownTimer setDone={setStart} seconds={3} minutes={0} />
              </>
            )}
            <button disabled={!questionDone} onClick={handleNext}>
              Next
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Page;
