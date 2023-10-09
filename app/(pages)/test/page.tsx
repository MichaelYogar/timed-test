"use client";
import { AUTH_CHECK } from "@/app/api/check/route";
import { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    const test = async () => {
      const result = await fetch(AUTH_CHECK, { method: "GET" });
      console.log(await result.json());
    };

    test();
  }, []);

  return <div>Test page</div>;
};

export default Page;
