import { options } from "@/app/api/auth/[...nextauth]/nextAuthOptions";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getServerSession(options);

  if (!session) redirect("api/auth/signin/credentials?callbackUrl=/result");

  return (
    <>
      {session ? (
        <div>{JSON.stringify(session)}</div>
      ) : (
        <h1 className="text-5xl">You Shall Not Pass!</h1>
      )}
    </>
  );
};

export default Page;
