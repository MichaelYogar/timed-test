"use client";

import { VIDEO_KEY, getVideos } from "@/lib/idb";
import { Prisma } from "@prisma/client";
import useSWR from "swr";

const fetcher = async (): Promise<any[]> => await getVideos();

const Page: React.FC<Prisma.QuestionCreateInput> = () => {
  const { data, error, isLoading } = useSWR(VIDEO_KEY, fetcher);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.toString()}</p>;

  return (
    <>
      <div>
        {data &&
          data.map((blob, index) => {
            if (blob)
              return (
                <video
                  key={index}
                  src={URL.createObjectURL(blob.video)}
                  controls
                />
              );
          })}
      </div>
    </>
  );
};

export default Page;
