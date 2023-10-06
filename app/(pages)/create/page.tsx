"use client";
import React, { useState } from "react";
import { INTERVIEW_ROUTE } from "@/app/api/interview/route";
import useSWR from "swr";
import { getUrlWithQueryParams } from "@/lib/utils";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Yup from "../../../lib/yup-extended";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";

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
  const [create, setCreate] = useState(false);

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
      .required("Must have friends")
      .min(2, "Minimum of 1 question"),
  });

  const form = useForm<Inputs>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: "hello",
      questions: [{ question: "hello", minutes: 0, seconds: 0 }],
    },
  });

  const { control } = form;

  const { fields, append, remove } = useFieldArray<Inputs>({
    name: "questions",
    control,
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    if (create) {
      // save data
    }

    // push title
  };

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {!create ? (
        data ? (
          data.map((item, i) => <div key={i}>{item.title}</div>)
        ) : (
          <div> No current interviews </div>
        )
      ) : (
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
                <div className="flex items-end mt-4" key={field.id}>
                  <div>{index + 1}</div>
                  <FormField
                    control={control}
                    name={`questions.${index}.question`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question: </FormLabel>
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
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() =>
                      append({
                        question: "new question",
                        minutes: 0,
                        seconds: 0,
                      })
                    }
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
            <p>{form.formState.errors.questions?.root?.message}</p>
            <Button>Submit</Button>
          </form>
        </Form>
      )}
      {!create ? (
        <Button onClick={() => setCreate(true)}>Create</Button>
      ) : (
        <Button onClick={() => setCreate(false)}>Back</Button>
      )}
    </div>
  );
};

export default Page;
