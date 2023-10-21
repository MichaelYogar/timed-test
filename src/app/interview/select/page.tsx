import { options } from "@/src/app/api/auth/[...nextauth]/nextAuthOptions";
import { SelectInterviewForm } from "@/src/components/SelectInterviewForm";
import { getServerSession } from "next-auth";

const Page = async () => {
  const session = await getServerSession(options);

  return (
    <div>
      <SelectInterviewForm userId={session?.user.id} />
    </div>
  );
};

export default Page;