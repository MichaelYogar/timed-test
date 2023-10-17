"use client";

import { AUTH_USER } from "@/app/api/auth/user/route";
import { Button } from "@/components/ui/button";
import { WEBSITE_NAME } from "@/lib/constants";
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
    <div className="h-screen flex items-center justify-center">
      <div className="md:border-[1px] border-gray-400 md:rounded-sm p-8">
        <h1 className="font-bold text-lg mb-2">{`Create a ${WEBSITE_NAME} Account`}</h1>
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

          <button>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Page;
