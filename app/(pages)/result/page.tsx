"use client";

import { Prisma } from "@prisma/client";
import useSWR from "swr";

const fetcher = async (): Promise<any[]> => {
  const result = await getVideos();
  console.log(result);
  return result;
};

const Page: React.FC<Prisma.QuestionCreateInput> = () => {
  const { data, error, isLoading } = useSWR("/videos", fetcher);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

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
