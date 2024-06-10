"use client";

import React, { useRef, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeProvider";
import { toast } from "@/components/ui/use-toast";

interface IQuestionForm {
  mongoUserId: string;
  type?: "Create" | "Edit";
  questionDetails?: string;
}
const QuestionForm = ({
  mongoUserId,
  type = "Create",
  questionDetails,
}: IQuestionForm) => {
  const { mode } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const parsedQuestion = JSON.parse(questionDetails ?? "{}");

  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: parsedQuestion.title || "",
      explanation: parsedQuestion.content || "",
      tags: parsedQuestion?.tags?.map((tag: any) => tag.name) || [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof QuestionSchema>) {
    setIsSubmitting(true);
    try {
      if (type === "Edit") {
        await editQuestion({
          questionId: parsedQuestion._id,
          title: values.title,
          content: values.explanation,
          path: pathname,
        });
        toast({
          description: "Question successfully edited",
        });
        router.push(`/question/${parsedQuestion._id}`);
      } else {
        await createQuestion({
          title: values.title,
          tags: values.tags,
          content: values.explanation,
          author: JSON.parse(mongoUserId),
          path: pathname,
        });
        toast({
          description: "Question successfully created",
        });
        router.push("/");
      }
    } catch (error) {
      toast({
        title: "Ooops...",
        description: "Something went wrong. Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleInputKeyDown = async (event: React.KeyboardEvent, field: any) => {
    if (event.key === "Enter" && field.name === "tags") {
      event.preventDefault();
      const tagInput = event.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag have to be less or equal 15 symbols",
          });
        }
        if (!field.value.includes(tagValue as never)) {
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        } else {
          await form.trigger();
        }
      }
    }
  };

  const handleRemoveTag = (tag: string, field: any) => {
    const newTags = field.value.filter((fieldTag: string) => fieldTag !== tag);
    form.setValue("tags", newTags);
  };

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
            <FormItem className={" flex w-full flex-col"}>
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
              <FormDescription
                className={"body-regular mt-2.5 text-light-500 "}
              >
                Be specific and imagine your&apos;re asking question to another
                person.
              </FormDescription>
              <FormMessage className={"body-regular text-red-500"} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className={"mt-10 flex w-full flex-col gap-3"}>
              <FormLabel className={"paragraph-semibold text-dark400_light900"}>
                Detailed explanation of your problem?
                <span className={"text-red-500"}>*</span>
              </FormLabel>
              <FormControl className={"mt-3.5"}>
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  // @ts-ignore
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  initialValue={parsedQuestion.content || ""}
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
                      "alignright alignjustify | bullist numlist outdent indent | ",
                    content_style: "body { font-family:Inter; font-size:16px }",
                    skin: mode === "dark" ? "oxide-dark" : "oxide",
                    content_css: mode === "dark" ? "dark" : "light",
                  }}
                />
              </FormControl>
              <FormDescription className={"body-regular mt-2.5 text-light-500"}>
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage className={"body-regular text-red-500"} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className={"mt-10 flex w-full flex-col"}>
              <FormLabel className={"paragraph-semibold text-dark400_light900"}>
                Tags
              </FormLabel>
              <FormControl className={"mt-3.5"}>
                <React.Fragment>
                  <Input
                    className={
                      "no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    }
                    disabled={type === "Edit"}
                    placeholder="Add tags..."
                    onKeyDown={(event) => handleInputKeyDown(event, field)}
                  />
                  {field.value.length > 0 && (
                    <div className={" flex-start mt-2.5 gap-2.5"}>
                      {field.value.map((tag) => (
                        <Badge
                          key={tag}
                          className={
                            "subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                          }
                        >
                          {tag}{" "}
                          {type !== "Edit" && (
                            <Image
                              src={"/assets/icons/close.svg"}
                              alt={"close-icon"}
                              height={12}
                              width={12}
                              className={
                                "cursor-pointer object-contain invert-0 dark:invert"
                              }
                              onClick={() => handleRemoveTag(tag, field)}
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              </FormControl>
              <FormDescription className={"body-regular mt-2.5 text-light-500"}>
                Add up to 3 tags to describe what your question is about. Start
                typing to see suggestions.
              </FormDescription>
              <FormMessage className={"body-regular text-red-500"} />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className={" primary-gradient mt-2.5 w-fit !text-light-900"}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>{type === "Edit" ? "Editing..." : "Posting..."}</>
          ) : (
            <>{type === "Edit" ? "Edit question" : "Ask a question"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default QuestionForm;
