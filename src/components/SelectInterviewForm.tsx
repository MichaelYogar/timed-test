"use client";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import Yup from "@/src/lib/yup-extended";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "./ui/Button";
import { Text } from "@radix-ui/themes";

const validationSchema = Yup.object().shape({
  id: Yup.string().required("Select one option."),
});

export const SelectInterviewForm = ({ data }: { data: any }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const router = useRouter();

  return (
    <div>
      <form
        onSubmit={handleSubmit(({ id }) => {
          localStorage.setItem("asdf", JSON.stringify(data));
          return router.push("/interview/" + id);
        })}
        className="space-y-6 relative"
      >
        <Text size="8">Select Test</Text>
        {data?.map((field, id) => {
          return (
            <span key={id}>
              <div className="flex items-center mb-2">
                <div className="flex flex-row items-center">
                  <input
                    type="radio"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                    id={field.title}
                    value={id}
                    {...register("id")}
                  />
                  <label htmlFor={field.title} className="ml-2 ">
                    <Text weight={"regular"} size="4">
                      {field.title}
                    </Text>
                  </label>
                </div>
              </div>
            </span>
          );
        })}
        <div className="grid grid-cols-2">
          <div>
            <Button>Start</Button>
            <div>{errors.id?.message}</div>
          </div>
          <div className="inline-block">
            <Button
              type="button"
              onClick={() => router.push("/interview/create")}
            >
              Create Test
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
