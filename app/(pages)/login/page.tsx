"use client";

import { AUTH_LOGIN } from "@/app/api/auth/login/route";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  username: string;
  password: string;
};

const Page = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const result = await fetch(AUTH_LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    console.log("Status: " + result.status);
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
