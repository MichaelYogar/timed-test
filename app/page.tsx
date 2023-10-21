import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { options } from "./api/auth/[...nextauth]/nextAuthOptions";
import Image from "next/image";
import coffee from "../public/images/coffee.jpg";
import { Button } from "@radix-ui/themes";

const Page = async () => {
  const session = await getServerSession(options);

  return (
    <div className="flex h-screen items-center mt-[-65px] gap-2 m-4">
      <article className="flex flex-col  basis-1/2  prose prose-sm md:prose prose-neutral prose-a:text-blue-600">
        <h1 className="inline">Practice makes perfect</h1>
        <p className="inline">
          Practice time based mock interviews created{" "}
          <span className="underline underline-offset-2">by you for you</span>
        </p>
        <Link className="w-fit" href="/interview/select">
          <Button size="3" variant="soft">
            Try Demo
          </Button>
        </Link>
      </article>
      <div className="basis-1/2">
        <Image src={coffee} alt="" />
      </div>
    </div>
  );
};

export default Page;
