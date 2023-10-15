import Link from "next/link";
import { NavBar } from "./components/Navbar";
import { getServerSession } from "next-auth/next";
import { options } from "./api/auth/[...nextauth]/nextAuthOptions";
import { WEBSITE_NAME } from "@/lib/constants";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Page = async () => {
  const session = await getServerSession(options);

  return (
    <div className="container">
      <div className="grid-rows-2 h-screen gap-[5%]">
        <NavBar user={session?.user!.name!} />
        <div className="h-full grid sm:grid-cols-2 items-center">
          <article className="mx-auto mb-[25%] prose prose-sm md:prose prose-neutral prose-a:text-blue-600 prose-p:text-black">
            <div>
              <h2 className="text-3xl font-semibold">{WEBSITE_NAME}</h2>
            </div>
            <blockquote className="border-l-2 italic">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </blockquote>
            <Link href="/start">
              <Button>Demo</Button>
            </Link>
          </article>
          <div>
            <Image
              src="https://images.unsplash.com/photo-1482192505345-5655af888cc4"
              alt="Mountains fill image"
              className="invisible sm:visible rounded object-cover"
              width={4544}
              height={2840}
              sizes="100vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
