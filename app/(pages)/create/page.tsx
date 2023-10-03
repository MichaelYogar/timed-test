"use client";
import React from "react";
import { INTERVIEW_ROUTE } from "@/app/api/interview/route";
import useSWR from "swr";
import { getUrlWithQueryParams } from "@/lib/utils";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";

const fetcher = async () => {
  const result = await fetch(
    getUrlWithQueryParams(INTERVIEW_ROUTE, { type: true }),
    {
      method: "GET",
    }
  );
  return await result.json();
};

type Inputs = {
  array: {
    question: string;
    seconds: number;
  }[];
};

const Page = () => {
  const { data, error, isLoading } = useSWR(INTERVIEW_ROUTE, fetcher);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Inputs>({
    defaultValues: {
      array: [{ question: "hello", seconds: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray<Inputs>({
    name: "array",
    control,
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => {
        return (
          <div key={field.id}>
            <label htmlFor="question">Question: </label>
            <input
              id="question"
              {...register(`array.${index}.question`)}
            ></input>
            <label htmlFor="seconds">Seconds: </label>
            <input
              id="seconds"
              type="number"
              {...register(`array.${index}.seconds`, {
                valueAsNumber: true,
                min: 0,
                max: 59,
              })}
            ></input>
            <Button
              variant="outline"
              type="button"
              onClick={() => append({ question: "new question", seconds: 0 })}
            >
              <PlusIcon />
            </Button>
            {index > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => remove(index)}
              >
                <MinusIcon />
              </Button>
            )}
          </div>
        );
      })}
      <button>Submit</button>
    </form>
  );
};

export default Page;
