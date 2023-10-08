"use client";
import React from "react";
import { INTERVIEW_ROUTE } from "@/app/api/interview/route";
import { getUrlWithQueryParams } from "@/lib/utils";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Yup from "../../../lib/yup-extended";
import { PlusIcon, MinusIcon, ArrowLeftIcon } from "@radix-ui/react-icons";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Interview } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { InterviewForm } from "@/app/components/InterviewForm";
import useSWR, { mutate } from "swr";
import Link from "next/link";

const fetcher = async (): Promise<Interview[]> => {
  const result = await fetch(
    getUrlWithQueryParams(INTERVIEW_ROUTE, { type: true }),
    {
      method: "GET",
    }
  );
  return await result.json();
};

type Inputs = {
  title: string;
  questions: {
    question: string;
    minutes: number;
    seconds: number;
  }[];
};

const Page = () => {
  const { data, error, isLoading } = useSWR(INTERVIEW_ROUTE, fetcher);

  const MIN_VALUE = 1;
  const MAX_VALUE = 10;
  const initialValue = {
    question: "",
    minutes: 0,
    seconds: 0,
  };
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
          seconds: Yup.number().min(0).max(60).required("Required"),
          minutes: Yup.number().min(0).max(60).required("Required"),
        })
      )
      .required("Must have questions")
      .min(MIN_VALUE, `Minimum of ${MIN_VALUE} question`)
      .max(MAX_VALUE, `Maximumof ${MAX_VALUE} question`),
  });

  const form = useForm<Inputs>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: "",
      questions: [initialValue],
    },
  });

  const { control } = form;

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
  };

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <Link href="/">
        <ArrowLeftIcon
          style={{ width: "32px", height: "32px", marginBottom: "4px" }}
        />
      </Link>
      <div className="grid md:grid-cols-2">
        <div>
          <h1>Create Interview</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex">
                <FormField
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interview title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {fields.map((field, index) => {
                return (
                  <div
                    className="flex lg:flex-row flex-col gap-1 lg:items-end items-start flex-wrap"
                    key={field.id}
                  >
                    <FormField
                      control={control}
                      name={`questions.${index}.question`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question {index + 1}: </FormLabel>
                          <FormControl>
                            <Input required className="w-fit" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`questions.${index}.minutes`}
                      render={({ field }) => (
                        <div className="flex justify-start items-start">
                          <FormItem>
                            <FormLabel>Minutes: </FormLabel>
                            <FormControl>
                              <Input
                                className="w-fit"
                                type="number"
                                min={0}
                                max={100}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        </div>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`questions.${index}.seconds`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seconds: </FormLabel>
                          <FormControl>
                            <Input
                              className="w-fit"
                              type="number"
                              min={0}
                              max={100}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-1">
                      {index <= MAX_VALUE && (
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => append(initialValue)}
                        >
                          <PlusIcon />
                        </Button>
                      )}
                      {index >= MIN_VALUE && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => remove(index)}
                        >
                          <MinusIcon />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
              <p>{form.formState.errors.questions?.root?.message}</p>
              <Button className="mt-4" variant="outline">
                Create
              </Button>
            </form>
          </Form>
        </div>

        <InterviewForm />
      </div>
    </div>
  );
};

export default Page;
