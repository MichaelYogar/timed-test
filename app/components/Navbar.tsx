import { Button } from "@/components/ui/button";
import Link from "next/link";

type NavbarProps = {
  user: string | undefined;
};

export const NavBar: React.FC<NavbarProps> = ({ user }) => {
  return (
    <div className="flex flex-row justify-between">
      <div></div>
      {user ? (
        <div>{user}</div>
      ) : (
        <div>
          <Link href="/user/login">
            <Button variant="link">login</Button>
          </Link>
          <Link href="/user/sign-up">
            <Button variant="link">signup</Button>
          </Link>
        </div>
      )}
    </div>
  );
};
