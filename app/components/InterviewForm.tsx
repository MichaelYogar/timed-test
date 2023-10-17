"use client";

import { useForm } from "react-hook-form";

import { getUrlWithQueryParams } from "@/lib/utils";
import { INTERVIEW_ROUTE } from "../api/interview/route";
import { Interview } from "@prisma/client";
import { useRouter } from "next/navigation";
import Yup from "@/lib/yup-extended";
import { yupResolver } from "@hookform/resolvers/yup";
import useSWRImmutable from "swr/immutable";

const fetcher = async (): Promise<Interview[]> => {
  const result = await fetch(
    getUrlWithQueryParams(INTERVIEW_ROUTE, { type: true }),
    {
      method: "GET",
    }
  );
  return await result.json();
};

const validationSchema = Yup.object().shape({
  id: Yup.string().required("Select one option."),
});

type InterviewFormProps = {
  loggedIn: boolean;
};

export const InterviewForm: React.FC<InterviewFormProps> = ({ loggedIn }) => {
  const { data, error, isLoading } = useSWRImmutable(INTERVIEW_ROUTE, fetcher);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const router = useRouter();

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex w-full justify-center">
      <form
        onSubmit={handleSubmit(({ id }) => {
          return router.push("/interview/" + id);
        })}
        className="space-y-6"
      >
        <h1>Current Interviews</h1>
        {data?.map((field, id) => {
          return (
            <div key={id}>
              <div className="flex items-center mb-2">
                <div className="flex flex-row ">
                  <input
                    type="radio"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                    id={field.title}
                    value={field.id}
                    {...register("id")}
                  />
                  <label htmlFor={field.title} className="ml-2 ">
                    {field.title}
                  </label>
                </div>
              </div>
            </div>
          );
        })}
        <div className="flex flex-row gap-2">
          <button>Start</button>
        </div>
        <div>{errors.id?.message}</div>
        <div className="group">
          <div className="inline-block">
            <button
              type="button"
              disabled={!loggedIn}
              onClick={() => router.push("/interview/create")}
            >
              Create new interview
            </button>
          </div>
          {!loggedIn && (
            <div className="w-full hide hidden group-hover:block group-hover:text-red-900">
              <p className="break-words">Login required.</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
