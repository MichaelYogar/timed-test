"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOut } from "next-auth/react";
import Link from "next/link";

type NavbarProps = {
  user: string | undefined;
};

export const NavBar: React.FC<NavbarProps> = ({ user }) => {
  return (
    <div className="px-8">
      <div className="flex flex-row justify-between">
        <div>{/* <p className="not-prose text-black">{user}</p> */}</div>
        {user ? (
          <div>
            <div className="inline-block">
              <Button className="h-0" variant="link" onClick={() => signOut()}>
                log out
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Link href="/user/login">
              <Button>login</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
