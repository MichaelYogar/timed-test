"use client";

import { NavBar } from "@/src/components/ui/Navbar";
import { PlusIcon } from "@radix-ui/react-icons";
import { Text } from "@radix-ui/themes";
import { useSession } from "next-auth/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();

  return (
    <div className="w-screen h-screen">
      <div className="grid grid-areas-layout grid-cols-layout grid-rows-layout h-full">
        <div className="grid-in-header bg-blue-100">
          <NavBar username={session.data?.user.name} />
        </div>
        <div className="grid-in-sidebar justify-self-center">
          <div className="flex flex-row items-center gap-2 my-2">
            <PlusIcon /> <Text size="5">Your tests</Text>
          </div>
          <div className="flex flex-row items-center gap-2 my-2">
            <PlusIcon /> <Text size="5">Edit tests</Text>
          </div>
          <div className="flex flex-row items-center gap-2 my-2">
            <PlusIcon /> <Text size="5">Create tests</Text>
          </div>
        </div>
        <div className="grid-in-main bg-red-100">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
