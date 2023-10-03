"use client";
import React, { useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { INTERVIEW_ROUTE } from "@/app/api/interview/route";
import useSWR from "swr";
import Link from "next/link";
import { getUrlWithQueryParams } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";

const initialValues = {
  question: "",
  seconds: 0,
  minutes: 0,
};

const fetcher = async () => {
  const result = await fetch(
    getUrlWithQueryParams(INTERVIEW_ROUTE, { type: true }),
    {
      method: "GET",
    }
  );
  return await result.json();
};

const validationSchema = Yup.object({
  interviewTitle: Yup.string().required(),
  forms: Yup.array()
    .of(
      Yup.object({
        question: Yup.string().min(4, "too short").required("Required"),
        seconds: Yup.number().min(0).max(60).required("Required"),
        minutes: Yup.number().min(0).max(60).required("Required"),
      })
    )
    .required("Must have friends")
    .min(1, "Minimum of 1 question"),
});

const Page = () => {
  const { data, error, isLoading } = useSWR(INTERVIEW_ROUTE, fetcher);
  const [create, setCreate] = useState(false);
  const router = useRouter();

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      {create ? (
        <Formik
          initialValues={{ interviewTitle: "", forms: [initialValues] }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              const res = await fetch(INTERVIEW_ROUTE, {
                headers: {
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(values),
              });
              if (res.status === 201) {
                const { id } = await res.json();
                alert(id);
                router.push(/interview/ + id);
              } else alert("Failed to create form");
            } catch (e) {
              console.log(e);
            }
          }}
        >
          {({ values, errors }) => (
            <Form>
              <div>
                <Field name="interviewTitle" placeholder="Interview title" />
              </div>
              <FieldArray
                name="forms"
                render={(arrayHelpers) => (
                  <div>
                    {values.forms.map((_, index) => (
                      <div key={index}>
                        <div>
                          <label htmlFor={`forms.${index}.question`}>
                            Question
                          </label>
                          <Field
                            id={`forms.${index}.question`}
                            name={`forms.${index}.question`}
                          />
                          <ErrorMessage name={`forms.${index}.question`} />
                        </div>

                        <div>
                          <label htmlFor={`forms.${index}.seconds`}>
                            Seconds
                          </label>
                          <Field
                            id={`forms.${index}.seconds`}
                            name={`forms.${index}.seconds`}
                          />
                          <ErrorMessage name={`forms.${index}.seconds`} />
                        </div>
                        <div>
                          <label htmlFor={`forms.${index}.minutes`}>
                            Minutes
                          </label>
                          <Field
                            id={`forms.${index}.minutes`}
                            name={`forms.${index}.minutes`}
                          />
                          <ErrorMessage name={`forms.${index}.minutes`} />
                        </div>

                        {index > 0 && (
                          <Button
                            variant="ghost"
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() =>
                            arrayHelpers.insert(index + 1, initialValues)
                          }
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {typeof errors.forms === "string" ? (
                      <div>{JSON.stringify(errors.forms)}</div>
                    ) : null}
                    <div>
                      <Button variant="outline" type="submit">
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
              />
            </Form>
          )}
        </Formik>
      ) : (
        <div>
          {data.map((item, index) => {
            return (
              <div key={index}>
                <Link href={/interview/ + item.id}>{item.title}</Link>
              </div>
            );
          })}
          <Button variant="outline" onClick={() => setCreate(true)}>
            Create
          </Button>
        </div>
      )}
    </>
  );
};

export default Page;
