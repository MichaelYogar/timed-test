"use client";
import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";

const initialValues = {
  question: "",
  seconds: 0,
  minutes: 0,
};

const Page = () => {
  const validationSchema = Yup.object({
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

  return (
    <Formik
      initialValues={{ forms: [initialValues] }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        fetch("/api/prep", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(values),
        })
          .then((res) => console.log(res))
          .catch((e) => console.log(e));
      }}
    >
      {({ values, errors }) => (
        <Form>
          <FieldArray
            name="forms"
            render={(arrayHelpers) => (
              <div>
                {values.forms.map((formItem, index) => (
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
                      <label htmlFor={`forms.${index}.seconds`}>Seconds</label>
                      <Field
                        id={`forms.${index}.seconds`}
                        name={`forms.${index}.seconds`}
                      />
                      <ErrorMessage name={`forms.${index}.seconds`} />
                    </div>
                    <div>
                      <label htmlFor={`forms.${index}.minutes`}>Minutes</label>
                      <Field
                        id={`forms.${index}.minutes`}
                        name={`forms.${index}.minutes`}
                      />
                      <ErrorMessage name={`forms.${index}.minutes`} />
                    </div>

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => arrayHelpers.remove(index)}
                      >
                        -
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        arrayHelpers.insert(index + 1, initialValues)
                      }
                    >
                      +
                    </button>
                  </div>
                ))}
                {typeof errors.forms === "string" ? (
                  <div>{JSON.stringify(errors.forms)}</div>
                ) : null}
                <div>
                  <button type="submit">Submit</button>
                </div>
              </div>
            )}
          />
        </Form>
      )}
    </Formik>
  );
};

export default Page;
