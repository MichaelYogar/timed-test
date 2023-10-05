"use client";
import React from "react";
import { INTERVIEW_ROUTE } from "@/app/api/interview/route";
import useSWR from "swr";
import { getUrlWithQueryParams } from "@/lib/utils";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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
  title: string;
  questions: {
    question: string;
    minutes: number;
    seconds: number;
  }[];
};

const Page = () => {
  const { data, error, isLoading } = useSWR(INTERVIEW_ROUTE, fetcher);
  const form = useForm<Inputs>({
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
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>{error}</div>;

  return (
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
                  </FormItem>
                )}
              />
              <Button
                variant="outline"
                type="button"
                onClick={() =>
                  append({ question: "new question", minutes: 0, seconds: 0 })
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
        <Button>Submit</Button>
      </form>
    </Form>
  );
};

export default Page;
