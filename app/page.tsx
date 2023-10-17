import Link from "next/link";
import { NavBar } from "./components/Navbar";
import { getServerSession } from "next-auth/next";
import { options } from "./api/auth/[...nextauth]/nextAuthOptions";

const Page = async () => {
  const session = await getServerSession(options);

  return (
    <article className="container mx-auto prose prose-sm md:prose prose-neutral pt-8 prose-a:text-blue-600 prose-p:text-black">
      <NavBar user={session?.user!.name!} />
      <div className="my-8">
        <p>Currently at prototype stage.</p>
      </div>
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        When to use iterative development? You should use iterative development
        only on projects that you want to succeed.
        <p>Martin Fowler</p>
      </blockquote>
      <div className="flex justify-center my-2">
        <Link href="/interview/select">Demo</Link>
      </div>
    </article>
  );
};

export default Page;
