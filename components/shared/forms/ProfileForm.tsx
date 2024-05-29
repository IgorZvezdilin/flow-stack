"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProfileSchema } from "@/lib/validations";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.action";

interface IProfileForm {
  clerkId: string;
  profileDetails: string;
}
const ProfileForm = ({ clerkId, profileDetails }: IProfileForm) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const parsedProfile = JSON.parse(profileDetails);

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: parsedProfile.name,
      username: parsedProfile.username,
      portfolioWebsite: parsedProfile.portfolioWebsite,
      location: parsedProfile.location,
      bio: parsedProfile.bio,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    setIsSubmitting(true);
    try {
      await updateUser({
        clerkId,
        updateData: {
          name: values.name,
          username: values.username,
          portfolioWebsite: values.portfolioWebsite,
          location: values.location,
          bio: values.bio,
        },
        path: pathname,
      });
      router.back();
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" mt-9 flex w-full flex-col gap-9"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className={" space-y-3.5 "}>
              <FormLabel className={"paragraph-semibold text-dark400_light900"}>
                Name <span className={"text-primary-500"}>*</span>
              </FormLabel>
              <FormControl className={"mt-3.5"}>
                <Input
                  className={
                    "no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  }
                  placeholder="write your name here!"
                  {...field}
                />
              </FormControl>
              <FormMessage className={"body-regular text-red-500"} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className={" space-y-3.5 "}>
              <FormLabel className={"paragraph-semibold text-dark400_light900"}>
                Username <span className={"text-primary-500"}>*</span>
              </FormLabel>
              <FormControl className={"mt-3.5"}>
                <Input
                  className={
                    "no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  }
                  placeholder="write your username here!"
                  {...field}
                />
              </FormControl>
              <FormMessage className={"body-regular text-red-500"} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portfolioWebsite"
          render={({ field }) => (
            <FormItem className={" space-y-3.5 "}>
              <FormLabel className={"paragraph-semibold text-dark400_light900"}>
                Portfolio link
              </FormLabel>
              <FormControl className={"mt-3.5"}>
                <Input
                  type={"url"}
                  className={
                    "no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  }
                  placeholder="write your portfolio link here!"
                  {...field}
                />
              </FormControl>
              <FormMessage className={"body-regular text-red-500"} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className={" space-y-3.5 "}>
              <FormLabel className={"paragraph-semibold text-dark400_light900"}>
                Location
              </FormLabel>
              <FormControl className={"mt-3.5"}>
                <Input
                  className={
                    "no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  }
                  placeholder="Where Are you from?"
                  {...field}
                />
              </FormControl>
              <FormMessage className={"body-regular text-red-500"} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className={" space-y-3.5 "}>
              <FormLabel className={"paragraph-semibold text-dark400_light900"}>
                Bio <span className={"text-primary-500"}>*</span>
              </FormLabel>
              <FormControl className={"mt-3.5"}>
                <Textarea
                  className={
                    "no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  }
                  placeholder="What`s special about you?"
                  {...field}
                />
              </FormControl>
              <FormMessage className={"body-regular text-red-500"} />
            </FormItem>
          )}
        />
        <div className={" mt-7 flex justify-end"}>
          <Button
            type="submit"
            className={" primary-gradient w-fit"}
            disabled={isSubmitting}
          >
            {isSubmitting ? <>Saving...</> : <>Save</>}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
