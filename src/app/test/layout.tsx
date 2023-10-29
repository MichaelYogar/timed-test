"use client";

import { NavBar } from "@/src/components/ui/Navbar";
import { useSession } from "next-auth/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();

  return (
    <div className="w-screen h-screen">
      <div className="grid grid-areas-layout grid-cols-layout grid-rows-layout h-full">
        <div className="grid-in-header bg-blue-100">
          <NavBar username={session.data?.user.name} />
        </div>
        <div className="grid-in-sidebar bg-slate-400"></div>
        <div className="grid-in-main bg-red-100">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
