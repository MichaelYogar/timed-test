"use client";

import React, { useState } from "react";
import { INTERVIEW_ROUTE } from "@/app/api/interview/route";
import { getUrlWithQueryParams } from "@/lib/utils";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Yup from "../../../../lib/yup-extended";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";

import { Interview } from "@prisma/client";
import useSWR, { mutate } from "swr";
import { useSession } from "next-auth/react";
import { Spinner } from "@/app/components/Snipper";
import { NavBar } from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";

const fetcher = async (): Promise<Interview[]> => {
  const result = await fetch(
    getUrlWithQueryParams(INTERVIEW_ROUTE, { type: true }),
    {
      method: "GET",
    }
  );
  return await result.json();
};

const MIN_VALUE = 1;
const MAX_VALUE = 5;
const initialValue = {
  question: "",
  minutes: 0,
  seconds: 0,
};

type Inputs = {
  title: string;
  questions: {
    question: string;
    minutes: number;
    seconds: number;
    minimum?: string;
  }[];
};

const Page = () => {
  const { data, error, isLoading } = useSWR(INTERVIEW_ROUTE, fetcher);
  const { data: session, status } = useSession();
  const [count, setCount] = useState(0);
  const router = useRouter();

  const validationSchema = Yup.object({
    title: Yup.string()
      .required()
      .unique(
        "Title must be unqiue",
        data?.map((item, _) => item.title)
      ),
    questions: Yup.array()
      .of(
        Yup.object({
          question: Yup.string().min(4, "too short").required("Required"),
          seconds: Yup.number()
            .typeError("Amount must be a number")
            .min(0, "Greater than 0")
            .max(60, "Less than 60")
            .required("Required"),
          minutes: Yup.number()
            .typeError("Amount must be a number")
            .min(0, "Greater than 0")
            .max(60, "Less than 60")
            .required("Required"),
        }).test(
          "at-least-one",
          "At least one of minutes or seconds must be greater than 0",
          function (values) {
            const { minutes, seconds } = values;
            if (!minutes && !seconds) {
              return this.createError({
                message:
                  "At least one of minutes or seconds must be greater than 0",
              });
            }
            return true;
          }
        )
      )
      .required("Must have questions")
      .min(MIN_VALUE, `Minimum of ${MIN_VALUE} question`)
      .max(MAX_VALUE, `Maximumof ${MAX_VALUE} question`),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: "",
      questions: [initialValue],
    },
  });

  const { fields, append, remove } = useFieldArray<Inputs>({
    name: "questions",
    control,
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const response = await fetch(INTERVIEW_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.status !== 201) {
      alert("Failed to create interview");
      return;
    }

    mutate(INTERVIEW_ROUTE);
    router.push("/interview/select");
  };

  const handleAdd = () => {
    const value = count + 1;
    if (value < MAX_VALUE) {
      append(initialValue);
      setCount(value);
    } else alert("Max number of questions");
  };

  const handleRemove = (index: number) => {
    setCount((value) => value - 1);
    remove(index);
  };

  if (isLoading)
    return (
      <div className="fixed top-1/2 left-1/2 translate-x-[-50%] trnaslate-y-[-50%]">
        <Spinner />
      </div>
    );
  if (error) return <div className="">{error}</div>;

  return (
    <div className="container my-2">
      <NavBar user={session?.user!.name!} />
      <div className="flex flex-col items-center my-10">
        <form
          style={{ margin: "0 auto" }}
          className="sm:w-[40%]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor="title">Interview Name</label>
          <input id="title" {...register("title")} />
          {fields.map((field, id) => {
            return (
              <div key={field.id}>
                <div className="flex flex-row gap-2">
                  <div className="basis-1/2">
                    <label htmlFor={`questions.${id}.question`}>
                      Question:
                    </label>
                    <input
                      id={`questions.${id}.question`}
                      {...register(`questions.${id}.question`)}
                    />
                    <p>
                      {errors.questions &&
                        errors.questions[id]?.question?.message}
                    </p>
                  </div>
                  <div className="basis-1/4">
                    <label htmlFor={`questions.${id}.minutes`}>Minutes: </label>
                    <input
                      id={`questions.${id}.minutes`}
                      {...register(`questions.${id}.minutes`)}
                    />
                    <p>
                      {errors.questions &&
                        errors.questions[id]?.minutes?.message}
                    </p>
                  </div>
                  <div className="basis-1/4">
                    <label htmlFor={`questions.${id}.seconds`}>Seconds: </label>
                    <input
                      id={`questions.${id}.seconds`}
                      {...register(`questions.${id}.seconds`)}
                    />
                    <p>
                      {errors.questions &&
                        errors.questions[id]?.seconds?.message}
                    </p>
                  </div>
                </div>
                <div>
                  <p>{errors.questions && errors.questions[id]?.message}</p>
                </div>
                <div className="inline-block">
                  <button type="button" onClick={handleAdd}>
                    <PlusIcon />
                  </button>
                  {id > 0 && (
                    <button type="button" onClick={() => handleRemove(id)}>
                      <MinusIcon />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <div className="group">
            <Button disabled={status === "unauthenticated"}>Submit</Button>
            {status === "unauthenticated" && (
              <div className="w-full hide hidden group-hover:block group-hover:text-red-900">
                <p className="break-words">Login required.</p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
