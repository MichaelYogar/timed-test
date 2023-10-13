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
        setError("password", {"type": "custom", "message": "Wrong password"});
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
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Username</label>
        <input {...register("username", { required: true })} />
        {errors.username && <span>This field is required</span>}

        <label>Password</label>
        <input {...register("password", { required: true })} />
        {errors.password && <span>{errors.password.message}</span>}

        <Button variant="outline">Submit</Button>
        <div>
          <p>Not a registered user?</p>
          <Link href="/user/sign-up">
            <Button variant="link">Sign up</Button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Page;
