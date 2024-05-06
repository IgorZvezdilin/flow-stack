"use client";

import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QuestionSchema } from "@/lib/validations";

const Question = () => {
  const editorRef = useRef(null);
  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: "",
      explanation: "",
      tags: [],
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof QuestionSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className={"flex w-full flex-col"}>
              <FormLabel className={"paragraph-semibold text-dark400_light900"}>
                Question title <span className={"text-red-500"}>*</span>
              </FormLabel>
              <FormControl className={"mt-3.5"}>
                <Input
                  className={
                    "no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  }
                  placeholder="write your question name here!"
                  {...field}
                />
              </FormControl>
              <FormDescription className={"body-regular mt-2.5 text-light-500"}>
                Be specific and imagine your&apos;re asking question to another
                person.
              </FormDescription>
              <FormMessage className={"text-red-500"} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className={"flex w-full flex-col gap-3"}>
              <FormLabel className={"paragraph-semibold text-dark400_light900"}>
                Detailed explanation of your problem?
                <span className={"text-red-500"}>*</span>
              </FormLabel>
              <FormControl className={"mt-3.5"}>
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  // @ts-ignore
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  initialValue=""
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "codesample",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | codesample |" +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
                  }}
                />
              </FormControl>
              <FormDescription className={"body-regular mt-2.5 text-light-500"}>
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage className={"text-red-500"} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className={"flex w-full flex-col"}>
              <FormLabel className={"paragraph-semibold text-dark400_light900"}>
                Tags
              </FormLabel>
              <FormControl className={"mt-3.5"}>
                <Input
                  className={
                    "no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  }
                  placeholder="Add tags..."
                  {...field}
                />
              </FormControl>
              <FormDescription className={"body-regular mt-2.5 text-light-500"}>
                Add up to 5 tags to describe what your question is about. Start
                typing to see suggestions.
              </FormDescription>
              <FormMessage className={"text-red-500"} />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default Question;