"use client";

import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";

import { getUrlWithQueryParams as createUrlWithQueryString } from "@/src/lib/utils";
import { Interview } from "@prisma/client";
import { useRouter } from "next/navigation";
import Yup from "@/src/lib/yup-extended";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "./ui/Button";
import useSWR, { mutate } from "swr";
import { Text } from "@radix-ui/themes";
import { useEffect } from "react";
import { INTERVIEW_ROUTE } from "../lib/routes";

const validationSchema = Yup.object().shape({
  id: Yup.string().required("Select one option."),
});

type InterviewFormProps = {
  userId: number | undefined;
};

export const SelectInterviewForm: React.FC<InterviewFormProps> = ({
  userId,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const router = useRouter();
  const pathName = usePathname();
  const key = `/page/${pathName}`;

  const fetcher = async (): Promise<Interview[]> => {
    const queryParams = userId ? { userId: userId } : {};

    const result = await fetch(
      createUrlWithQueryString(INTERVIEW_ROUTE, queryParams),
      {
        method: "GET",
      }
    );
    return await result.json();
  };

  const { data, error, isLoading } = useSWR(key, fetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: true,
  });

  useEffect(() => {
    // Clear the data when the component unmounts (leaves the page)
    return () => {
      mutate(key, null);
    };
  }, [key]);

  if (error) return <div>{error}</div>;
  if (isLoading) return <></>;

  return (
    <div className="h-screen w-screen">
      <div
        style={{
          margin: "auto",
          maxWidth: "90vw",
          width: "640px",
        }}
      >
        <form
          onSubmit={handleSubmit(({ id }) => {
            localStorage.setItem("asdf", JSON.stringify(data));
            return router.push("/interview/" + id);
          })}
          className="space-y-6 relative"
        >
          <Text size="8">Current interviews</Text>
          {data?.map((field, id) => {
            return (
              <div key={id}>
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
                      <Text size="4">{field.title}</Text>
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="">
            <Button>Start</Button>
            <div>{errors.id?.message}</div>
          </div>
          <div className="inline-block">
            <Button
              type="button"
              onClick={() => router.push("/interview/create")}
            >
              Create new interview
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
