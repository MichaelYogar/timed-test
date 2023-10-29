"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./Button";

type NavbarProps = {
  username: string | undefined | null;
};

export const NavBar: React.FC<NavbarProps> = ({ username }) => {
  return (
    <div className="flex justify-end w-full">
      {username ? (
        <div>
          <div className="inline-block">
            <Button onClick={() => signOut()}>log out</Button>
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
  );
};
