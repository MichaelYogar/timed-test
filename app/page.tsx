import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const page = () => {
  return (
    <article className="container mx-auto prose prose-sm md:prose pt-8">
      <h3>About</h3>
      <div className="flex justify-end">
        <Button variant="link" asChild>
          <Link href="/create">Try me</Link>
        </Button>
      </div>
      <div className="mb-8">Currently at prototype stage.</div>
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        When to use iterative development? You should use iterative development
        only on projects that you want to succeed.
        <p>Martin Fowler</p>
      </blockquote>
      <Separator />
      <div className="flex justify-center my-2">
        <a>Github</a>
      </div>
    </article>
  );
};

export default page;
