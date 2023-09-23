import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { TimeFormValues } from "@/types/TimeForm";

interface InputProps {
  onValueChange: (time: TimeFormValues) => void;
}

interface FormErrors {
  minutes?: string;
  seconds?: string;
}

export function TimeInput({ onValueChange }: InputProps) {
  const initialValues: TimeFormValues = {
    minutes: 0,
    seconds: 0,
  };

  const validate = (values: TimeFormValues) => {
    const errors: Partial<FormErrors> = {};

    if (!values.minutes) {
      errors.minutes = "Minutes are required";
    } else if (isNaN(Number(values.minutes)) || Number(values.minutes) < 0) {
      errors.minutes = "Minutes must be 0 or more";
    }

    if (!values.seconds) {
      errors.seconds = "Seconds are required";
    } else if (
      isNaN(Number(values.seconds)) ||
      Number(values.seconds) < 0 ||
      Number(values.seconds) > 59
    ) {
      errors.seconds = "Seconds must be between 0 and 59";
    }

    return errors;
  };

  const onSubmit = (
    values: TimeFormValues,
    { setSubmitting }: FormikHelpers<TimeFormValues>
  ) => {
    onValueChange({ minutes: values.minutes, seconds: values.seconds });
    setSubmitting(false);
  };

  return (
    <div>
      <h2>Submit Minutes & Seconds</h2>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
      >
        {() => (
          <Form>
            <div>
              <label htmlFor="minutes">Minutes:</label>
              <Field type="number" id="minutes" name="minutes" />
              <ErrorMessage name="minutes" component="div" className="error" />
            </div>

            <div>
              <label htmlFor="seconds">Seconds:</label>
              <Field type="number" id="seconds" name="seconds" />
              <ErrorMessage name="seconds" component="div" className="error" />
            </div>
            <div>
              <button type="submit">Submit</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
