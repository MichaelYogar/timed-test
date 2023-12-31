import { HomeIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export const Finished = () => {
  return (
    <div className="container h-screen flex justify-center items-center flex-col ">
      <div className="flex items-start flex-col">
        <Link href="/">
          <HomeIcon
            style={{ width: "32px", height: "32px", marginBottom: "4px" }}
          />
        </Link>
        <div className="border-black border-solid border-2 p-4 rounded-sm">
          <h1>Finished!</h1>
          <p>
            Email feedback:
            <a href="mailto:someone@example.com">
              <button>michaelyogar878@gmail.com</button>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
