"use client";

import React, { useState } from "react";
import { INTERVIEW_ROUTE } from "@/app/api/interview/route";
import { getUrlWithQueryParams } from "@/lib/utils";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Yup from "../../../../lib/yup-extended";
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
import useSWR, { mutate } from "swr";
import { useSession } from "next-auth/react";
import { Spinner } from "@/app/components/Snipper";
import { NavBar } from "@/app/components/Navbar";
import { useRouter } from "next/navigation";

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
  const { data: session, status } = useSession();
  const [count, setCount] = useState(0);
  const router = useRouter();

  const MIN_VALUE = 1;
  const MAX_VALUE = 5;
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
    <div>
      <NavBar user={session?.user!.name!} />
      <div className="container mx-auto h-screen flex flex-col items-center my-10">
        <div>
          <div>
            <h1>Create Interview</h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div>
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
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => handleAdd()}
                        >
                          <PlusIcon />
                        </Button>
                        {index >= MIN_VALUE && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleRemove(index)}
                          >
                            <MinusIcon />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
                <p>{form.formState.errors.questions?.root?.message}</p>
                <div className="group inline-block">
                  <div>
                    <p>
                      Questions remaining: {Math.max(MAX_VALUE - count - 1, 0)}
                    </p>
                  </div>
                  <Button
                    disabled={!session}
                    className="myDIV mt-4"
                    variant="outline"
                  >
                    Create
                  </Button>
                  {!session && (
                    <div className="hide hidden group-hover:block group-hover:text-red-500">
                      Users required to log in :D
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
