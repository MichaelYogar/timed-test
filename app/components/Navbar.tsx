"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";

type NavbarProps = {
  user: string | undefined | null;
};

export const NavBar: React.FC<NavbarProps> = ({ user }) => {
  return (
    <div className="px-8">
      <div className="flex flex-row justify-between">
        <div>{/* <p className="not-prose text-black">{user}</p> */}</div>
        {user ? (
          <div>
            <div className="inline-block">
              <button className="h-0" onClick={() => signOut()}>
                log out
              </button>
            </div>
          </div>
        ) : (
          <div>
            <Link href="/user/login">
              <button>login</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
