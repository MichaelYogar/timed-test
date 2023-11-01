"use client";
import { SelectInterviewForm } from "@/src/components/SelectInterviewForm";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getUrlWithQueryParams as createUrlWithQueryString } from "@/src/lib/utils";
import { INTERVIEW_ROUTE } from "@/src/lib/routes";
import useSWR, { mutate } from "swr";
import { useSession } from "next-auth/react";
import { Button } from "@/src/components/ui/Button";

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
  const router = useRouter();
  const key = `/page/${pathName}`;

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
    <div
      style={{ gridTemplateRows: "1fr auto" }}
      className="grid grid-cols-1 justify-items-center  h-full"
    >
      {data && data.length > 0 ? (
        <SelectInterviewForm data={data} />
      ) : (
        <div className="h-full flex flex-col justify-center items-center">
          <p>No tests</p>
          <Button onClick={() => router.push("/interview/create")}>
            Create new test!
          </Button>
        </div>
      )}
    </div>
  );
};

export default Page;
