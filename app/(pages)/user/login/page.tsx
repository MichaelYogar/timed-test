"use client";

import { Button } from "@/components/ui/button";
import { SignInResponse, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

type LoginInput = {
  username: string;
  password: string;
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
      setError("password", { type: "custom", message: "Wrong password" });
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
      <div className="md:border-[1px] border-gray-400 md:rounded-sm p-8 w-[30%]">
        <div className="mb-2">
          <h1 className="text-center">Sign in</h1>
          <h3 className="text-center text-sm">Use your Oneprep Account</h3>
        </div>
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
          {errors.password && <span>{errors.password.message}</span>}
          <div className="flex justify-around">
            <Link href="/user/sign-up">
              <Button
                size="lg"
                className="text-[rgb(26,115,232)]"
                type="button"
                variant="link"
              >
                Create account
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Submit
            </Button>
          </div>
        </form>
        <div></div>
      </div>
    </div>
    // <div>
    //   <form onSubmit={handleSubmit(onSubmit)}>
    //     <label>Username</label>
    //     <input {...register("username", { required: true })} />
    //     {errors.username && <span>This field is required</span>}

    //     <label>Password</label>
    //     <input {...register("password", { required: true })} />
    //     {errors.password && <span>{errors.password.message}</span>}

    //     <Button variant="outline">Submit</Button>
    //     <div>
    //       <p>Not a registered user?</p>
    //       <Link href="/user/sign-up">
    //         <Button variant="link">Sign up</Button>
    //       </Link>
    //     </div>
    //   </form>
    // </div>
  );
};

export default Page;
