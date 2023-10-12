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
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Username</label>
        <input {...register("username", { required: true })} />
        {errors.username && <span>This field is required</span>}

        <label>Password</label>
        <input {...register("password", { required: true })} />
        {errors.password && <span>This field is required</span>}

        <Button variant="outline">Submit</Button>
      </form>
    </div>
  );
};

export default Page;
