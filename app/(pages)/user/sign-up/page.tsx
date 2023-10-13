"use client";

import { AUTH_USER } from "@/app/api/auth/user/route";
import { Button } from "@/components/ui/button";
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
        <h1 className="font-bold text-lg mb-2">Create a Oneprep Account</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your username
            </label>
            <input
              {...register("username", { required: true })}
              id="username"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            {errors.username && <span>This field is required</span>}
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: true })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
            {errors.password && <span>This field is required</span>}
          </div>

          <Button variant="outline">Submit</Button>
        </form>
      </div>
    </div>
  );
};

export default Page;
