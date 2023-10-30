"use client";

import { NavBar } from "@/src/components/ui/Navbar";
import { Button, Text } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CiSquarePlus, CiEdit } from "react-icons/ci";
import { VscBook } from "react-icons/vsc";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const router = useRouter();

  return (
    <div className="w-screen h-screen">
      <div className="grid grid-areas-layout grid-cols-layout grid-rows-layout h-full">
        <div className="grid-in-header bg-blue-100">
          <NavBar username={session.data?.user.name} />
        </div>
        <div className="grid-in-sidebar justify-self-center w-full">
          <Button
            color="green"
            variant="soft"
            onClick={() => router.push("/interview/edit")}
            className="flex flex-row items-center gap-2 my-2 cursor-pointer w-full"
          >
            <CiEdit size={30} /> <Text size="5">Edit</Text>
          </Button>
          <Button
            color="indigo"
            variant="soft"
            onClick={() => router.push("/interview/create")}
            className="flex flex-row items-center gap-2 my-2 cursor-pointer w-full"
          >
            <CiSquarePlus size={30} /> <Text size="5">Create</Text>
          </Button>
          <Button
            color="red"
            variant="soft"
            onClick={() => router.push("/interview/select")}
            className="flex flex-row items-center gap-2 my-2 cursor-pointer w-full"
          >
            <VscBook size={30} /> <Text size="5">Start</Text>
          </Button>
        </div>
        <div className="grid-in-main bg-red-100">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
