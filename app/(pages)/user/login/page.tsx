"use client";

import { Button } from "@/app/components/ui/Button";
import { WEBSITE_NAME } from "@/lib/constants";
import { SignInResponse, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

type LoginInput = {
  username: string;
  password: string;
  error: string;
};

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>();

  const router = useRouter();

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    const result = (await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    })) as SignInResponse;

    if (result.status === 401) {
      console.log(errors);
      setError("error", {
        type: "custom",
        message: "Incorrect username or password",
      });
      return;
    }

    const url = new URL(result?.url as string);
    const redirectUrl = url.searchParams.get("callbackUrl")!;
    if (result.ok) {
      if (redirectUrl) router.push(redirectUrl);
      else {
        router.refresh();
        router.back();
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="md:border-[1px] border-gray-400 md:rounded-sm p-8 lg:w-[30%]">
        <div className="mb-2">
          <h1 className="text-center">Sign in</h1>
          <h3 className="text-center text-sm">{`Use your ${WEBSITE_NAME} Account`}</h3>
        </div>
        <div>
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
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                <span className="font-medium">
                  {errors.error && <span>{errors.error.message}</span>}
                </span>{" "}
              </p>
            </div>
            <div className="flex justify-between">
              <Link href="/user/sign-up">
                <Button type="button">Create account</Button>
              </Link>
              <Button>Submit</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
