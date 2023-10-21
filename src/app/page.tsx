import Link from "next/link";
import Image from "next/image";
import coffee from "../../public/images/coffee.jpg";
import { Button, Text } from "@radix-ui/themes";
import { NavBar } from "../components/ui/Navbar";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/nextAuthOptions";

const Page = async () => {
  const session = await getServerSession(options);

  return (
    <div>
      <NavBar user={session?.user.name} />
      <div className="flex h-screen items-center mt-[-65px] gap-2 m-4">
        <article className="flex flex-col sm:basis-2/3  prose prose-sm md:prose prose-neutral prose-a:text-blue-600">
          <Text mb="2" weight="bold" size="9">
            Practice makes perfect
          </Text>
          <Text mb="2" size="4">
            Practice time based mock interviews created{" "}
            <span className="underline underline-offset-2">by you for you</span>
          </Text>
          <Link className="w-fit" href="/interview/select">
            <Button size="3" variant="soft">
              Try Demo
            </Button>
          </Link>
        </article>
        <div className="basis-1/3 invisible sm:visible">
          <Image src={coffee} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Page;
