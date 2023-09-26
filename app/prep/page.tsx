"use client";

import React from "react";
import { Formik, Form } from "formik";
import { FormikInput } from "@/components/forms/FormikInput";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";

const SignupForm = () => {
  const router = useRouter();
  const initialValues = {
    question: "",
    minutes: 0,
    seconds: 0,
  };

  const validationSchema = Yup.object().shape({
    question: Yup.string().required(),
    seconds: Yup.number().min(0).max(60).required(),
    minutes: Yup.number().min(0).max(60).required(),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      setSubmitting(false);
      router.push("/video" + "?" + new URLSearchParams(values).toString());
    }, 400);
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <Form>
          <FormikInput label="Question" name="question" type="text" />
          <FormikInput label="Minutes" name="minutes" type="number" />
          <FormikInput label="Seconds" name="seconds" type="number" />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </>
  );
};

export default SignupForm;
