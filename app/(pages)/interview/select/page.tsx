import { options } from "@/app/api/auth/[...nextauth]/nextAuthOptions";
import { InterviewForm } from "@/app/components/InterviewForm";
import { NavBar } from "@/app/components/ui/Navbar";
import { getServerSession } from "next-auth";

const Page = async () => {
  const session = await getServerSession(options);

  return (
    <div>
      <NavBar user={session?.user?.name} />
      <InterviewForm loggedIn={session !== null} />
    </div>
  );
};

export default Page;
