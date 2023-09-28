"use client";

import { Question } from "@/app/components/Question";
import { Prisma } from "@prisma/client";
import { useState } from "react";
import useSWR from "swr";

const fetcher = async () => {
  const result = await fetch("/api/prep", { method: "GET" });
  return await result.json();
};

const Page: React.FC<Prisma.QuestionCreateInput> = () => {
  const [index, setIndex] = useState(0);
  const [questionDone, setQuestionDone] = useState(false);
  const { data, error, isLoading } = useSWR("/api/user/123", fetcher);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  return (
    <>
      <div>
        {index < data.length && (
          <Question
            setQuestionDone={setQuestionDone}
            key={index}
            content={data[index].content}
            duration={data[index].duration}
          />
        )}
      </div>
      <button
        disabled={!questionDone}
        onClick={() => setIndex((prevIndex) => prevIndex + 1)}
      >
        Next
      </button>
    </>
  );
};

export default Page;
