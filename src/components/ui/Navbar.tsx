"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./Button";

type NavbarProps = {
  user: string | undefined | null;
};

export const NavBar: React.FC<NavbarProps> = ({ user }) => {
  return (
    <div className="flex flex-row justify-between mt-2">
      <div>{/* <p className="not-prose text-black">{user}</p> */}</div>
      {user ? (
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
