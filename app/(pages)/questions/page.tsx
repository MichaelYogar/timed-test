"use client";

import { PREP_ROUTE } from "@/app/api/prep/route";
import { CountdownTimer } from "@/app/components/CountdownTimer";
import { Question } from "@/app/components/Question";
import { clearVideos } from "@/lib/idb";
import { useState } from "react";
import useSWR from "swr";

const fetcher = async () => {
  const result = await fetch(PREP_ROUTE, { method: "GET" });
  return await result.json();
};

const Page = () => {
  const [index, setIndex] = useState(0);
  const [start, setStart] = useState(false);
  const [questionDone, setQuestionDone] = useState(false);

  const { data, error, isLoading } = useSWR(PREP_ROUTE, fetcher);

  const handleNext = async () => {
    setIndex((prevIndex) => prevIndex + 1);
    setStart(false);
    setQuestionDone(false);
    await clearVideos();
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.toString()}</p>;
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
                <CountdownTimer setDone={setStart} seconds={10} minutes={0} />
              </>
            )}
          </>
        )}
      </div>
      <button disabled={!questionDone} onClick={handleNext}>
        Next
      </button>
    </>
  );
};

export default Page;
