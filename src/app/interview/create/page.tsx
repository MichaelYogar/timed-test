"use client";

import React, { useState } from "react";
import { getUrlWithQueryParams } from "@/src/lib/utils";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Yup from "../../../lib/yup-extended";
import { CheckIcon, PlusCircledIcon, TrashIcon } from "@radix-ui/react-icons";

import { Interview } from "@prisma/client";
import useSWR, { mutate } from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { INTERVIEW_ROUTE } from "@/src/lib/routes";
import { Button, Card } from "@radix-ui/themes";

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
  const { data: session, status } = useSession();
  const [count, setCount] = useState(0);
  const router = useRouter();

  const fetcher = async (): Promise<Interview[]> => {
    const result = await fetch(
      getUrlWithQueryParams(INTERVIEW_ROUTE, {
        type: true,
        userId: session?.user.id,
      }),
      {
        method: "GET",
      }
    );
    return await result.json();
  };

  const { data, error, isLoading } = useSWR(INTERVIEW_ROUTE, fetcher);

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
    if (!session) {
      alert("User must be signed in");
      return;
    }

    const response = await fetch(INTERVIEW_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, userId: session.user.id }),
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

  // if (isLoading)
  //   return (
  //     <div className="fixed top-1/2 left-1/2 translate-x-[-50%] trnaslate-y-[-50%]">
  //       <Spinner />
  //     </div>
  //   );
  if (error) return <div className="">{error}</div>;

  return (
    <div className="grid gird-cols-1 justify-items-center">
      <div className="w-full justify-items-center items-center grid grid-cols-2 border-gray-100 border-b-[1px] py-2">
        <div>Create Test Form</div>
        <div>
          <Button form="form1" radius="medium" variant="outline">
            Save <CheckIcon width="16" height="16" />
          </Button>
        </div>
      </div>
      <form id="form1" className="px-[25%]" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="title">Title</label>
        <input id="title" {...register("title")} />
        {fields.map((field, id) => {
          return (
            <Card className="my-2" key={field.id}>
              <div className="grid grid-rows-2">
                <div>
                  <label htmlFor={`questions.${id}.question`}>Question:</label>
                  <input
                    id={`questions.${id}.question`}
                    {...register(`questions.${id}.question`)}
                  />
                  <p>
                    {errors.questions &&
                      errors.questions[id]?.question?.message}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div>
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
                  <div>
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
              </div>
              <div>
                <p>{errors.questions && errors.questions[id]?.message}</p>
              </div>
              <div className="inline-block float-right">
                <button type="button" onClick={handleAdd}>
                  <PlusCircledIcon />
                </button>
                {id > 0 && (
                  <button type="button" onClick={() => handleRemove(id)}>
                    <TrashIcon />
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </form>
    </div>
  );
};

export default Page;
