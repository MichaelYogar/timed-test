"use client";

import { INTERVIEW_ROUTE } from "@/src/lib/routes";
import { getUrlWithQueryParams as createUrlWithQueryString } from "@/src/lib/utils";
import { Card } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import { Prisma } from "@prisma/client";

const interviewWithQuestions = Prisma.validator<Prisma.InterviewDefaultArgs>()({
  include: { questions: true },
});

type InterviewWithQuestions = Prisma.InterviewGetPayload<
  typeof interviewWithQuestions
>;

const fetcher = async (userId): Promise<InterviewWithQuestions[]> => {
  const queryParams = userId ? { userId: userId } : {};

  const result = await fetch(
    createUrlWithQueryString(INTERVIEW_ROUTE, queryParams),
    {
      method: "GET",
    }
  );
  return await result.json();
};

const Page = () => {
  const session = useSession();
  const pathName = usePathname();
  const key = `/page/${pathName}`;
  const [interview, setInterview] = useState<InterviewWithQuestions | null>(
    null
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Clear the data when the component unmounts (leaves the page)
    return () => {
      mutate(key, null);
    };
  }, [key]);

  const { data, error, isLoading } = useSWR(
    () => key + session.data?.user.id,
    () => fetcher(session.data?.user.id)
  );

  if (error) return <div>{error}</div>;
  if (isLoading) return <></>;

  console.log(interview);

  return (
    <div style={{ gridTemplateColumns: "20% 1fr" }} className="grid h-full">
      <div className="border-r-2 border-black">
        {data &&
          data.length > 0 &&
          data.map((field, id) => {
            return (
              <div key={id}>
                <button onClick={() => setInterview(field)}>
                  {field.title}
                </button>
              </div>
            );
          })}
      </div>
      <div className="grid grid-cols-1 justify-items-center items-center">
        {!interview ? (
          <p>Card</p>
        ) : (
          <Card>
            {interview.questions.map((field, id) => {
              return <div key={id}>{field.content}</div>;
            })}
          </Card>
        )}
      </div>
    </div>
  );
};

export default Page;
