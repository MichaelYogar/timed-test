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
  id: Yup.string().required("Please select one option."),
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
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit(({ id }) => {
          return router.push("/interview/" + id);
        })}
        className="space-y-6"
      >
        {data?.map((field, id) => {
          return (
            <div key={id}>
              <input
                type="radio"
                id={field.title}
                value={field.id}
                {...register("id")}
              />
              <label htmlFor={field.title}>{field.title}</label>
            </div>
          );
        })}
        <div>{errors.id?.message}</div>
        <div className="flex justify-between">
          <button>Submit</button>
          <button
            type="button"
            disabled={!loggedIn}
            onClick={() => router.push("/interview/create")}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};
