"use client";

import { Button } from "@/src/components/ui/Button";
import { WEBSITE_NAME } from "@/src/lib/constants";
import { AUTH_USER } from "@/src/lib/routes";
import { Text } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  username: string;
  password: string;
};

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const result = await fetch(AUTH_USER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (result.status === 409) {
        alert(`'${data.username}' already exists`);
      } else {
        router.push("/user/login");
      }
    } catch (error) {}
  };

  return (
    <div className="h-screen flex items-center justify-center mt-[-30px]">
      <div className="md:border-[1px] border-gray-400 md:rounded-sm p-8 w-1/2">
        <Text
          weight="bold"
          size="6"
          as="div"
          className="mb-2 text-center"
        >{`Create a ${WEBSITE_NAME} Account`}</Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label htmlFor="username">Your username</label>
            <input
              {...register("username", { required: true })}
              id="username"
            />
            {errors.username && <span>This field is required</span>}
          </div>
          <div className="mb-6">
            <label htmlFor="password">Your password</label>
            <input
              type="password"
              id="password"
              {...register("password", { required: true })}
            />
            {errors.password && <span>This field is required</span>}
          </div>

          <Button>Create</Button>
        </form>
      </div>
    </div>
  );
};

export default Page;
