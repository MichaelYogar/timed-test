"use client";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getUrlWithQueryParams } from "@/lib/utils";
import { INTERVIEW_ROUTE } from "../api/interview/route";
import { Interview } from "@prisma/client";
import { useRouter } from "next/navigation";
import Yup from "@/lib/yup-extended";
import { yupResolver } from "@hookform/resolvers/yup";
import useSWRImmutable from "swr/immutable";

const fetcher = async (): Promise<Interview[]> => {
  const result = await fetch(
    getUrlWithQueryParams(INTERVIEW_ROUTE, { type: true }),
    {
      method: "GET",
    }
  );
  return await result.json();
};

const validationSchema = Yup.object().shape({
  id: Yup.string().required(),
});

export const InterviewForm = () => {
  const { data, error, isLoading } = useSWRImmutable(INTERVIEW_ROUTE, fetcher);
  const form = useForm({
    resolver: yupResolver(validationSchema),
  });
  const router = useRouter();

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(({ id }) =>
          router.push("/interview/" + id)
        )}
        className="w-2/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Current Interviews</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                  name="selection"
                >
                  {data &&
                    data.map((item, i) => {
                      return (
                        <FormItem
                          key={i}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={item.id.toString()} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.title}
                          </FormLabel>
                        </FormItem>
                      );
                    })}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="ghost" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};
