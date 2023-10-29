"use client";
import { SelectInterviewForm } from "@/src/components/SelectInterviewForm";
import { NavBar } from "@/src/components/ui/Navbar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getUrlWithQueryParams as createUrlWithQueryString } from "@/src/lib/utils";
import { INTERVIEW_ROUTE } from "@/src/lib/routes";
import useSWR, { mutate } from "swr";
import { useSession } from "next-auth/react";
import { Button } from "@/src/components/ui/Button";
import { useRouter } from "next/navigation";
import { ViewInterview } from "@/src/components/ViewInterview";

const fetcher = async (userId): Promise<any[]> => {
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
  const router = useRouter();

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

  return (
    <div>
      <NavBar username={session?.data?.user.name} />
      <div
        style={{ gridTemplateRows: "1fr auto" }}
        className="grid sm:grid-cols-2 sm:justify-items-center"
      >
        <SelectInterviewForm data={data} />
        <ViewInterview data={data} />
      </div>
    </div>
  );
};

export default Page;
