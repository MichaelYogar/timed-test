"use client";

import { INTERVIEW_ROUTE } from "@/src/lib/routes";
import { getUrlWithQueryParams as createUrlWithQueryString } from "@/src/lib/utils";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import { Prisma } from "@prisma/client";
import { InterviewTable } from "./InterviewTable";
import { useEffect, useState } from "react";

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
  const [row, setRow] = useState({});
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

  useEffect(() => {
    if (data && data.length > 0) setInterview(data[0]);
  }, [data]);

  if (error) return <div>{error}</div>;
  if (isLoading) return <></>;

  const handleEdit = () => {
    const keys = Object.keys(row);
    if (keys.length > 1) console.log("Should only be one key");
    const rowId = Number(keys[0]);
    consolelog(rowId);
  };

  return (
    <div className="h-full">
      <div className="w-full justify-items-center items-center grid grid-cols-2 border-gray-100 border-b-[1px] py-2">
        <div>Create Test Form</div>
      </div>
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
          {interview && (
            <InterviewTable
              data={interview.questions}
              onRowSelectStateChange={setRow}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
