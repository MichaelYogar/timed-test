"use client";
import { SimpleTimer } from "@/src/components/SimpleTimer";

const Page = () => {
  return (
    <div className="w-screen h-screen">
      <div className="h-10 grid grid-cols-2 place-items-center">
        <div>1</div>
        <div>
          <SimpleTimer minutes={1} seconds={30} />
        </div>
      </div>
      <div>video</div>
    </div>
  );
};

export default Page;
