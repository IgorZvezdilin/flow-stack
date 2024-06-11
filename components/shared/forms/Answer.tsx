"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnswerSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Editor } from "@tinymce/tinymce-react";
import React, { useRef, useState } from "react";
import { useTheme } from "@/context/ThemeProvider";
import Image from "next/image";
import Shrink from "../../../public/assets/icons/stars.svg";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

interface IAnswerForm {
  question: string;
  questionId: string;
  userId: string;
}
const AnswerForm = ({ question, questionId, userId }: IAnswerForm) => {
  const { mode } = useTheme();
  const pathName = usePathname();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmittingAI, setIsSubmittingAI] = useState<boolean>(false);
  const editorRef = useRef(null);
  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  });

  const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
    if (JSON.parse(userId)) {
      setIsSubmitting(true);
      try {
        await createAnswer({
          author: JSON.parse(userId),
          question: JSON.parse(questionId),
          content: values.answer,
          path: pathName,
        });

        form.reset();
        if (editorRef.current) {
          const editor = editorRef.current as any;
          editor.setContent("");
        }
        toast({
          description: "Answer successfully created",
        });
      } catch (error) {
        console.log(error);
        toast({
          title: "Ooops...",
          description: "Something went wrong. Please try again later",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast({
        title: "Please log in.",
        description: "You must be logged in to perform this action",
      });
    }
  };

  const handleCreateAIAnswer = async () => {
    if (!userId)
      return toast({
        title: "Please log in.",
        description: "You must be logged in to perform this action",
      });
    setIsSubmittingAI(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/yagpt`,
        {
          method: "POST",
          body: JSON.stringify(question),
        },
      );
      const aiAnswer = await response.json();
      console.log("aiAnswer", aiAnswer);
      const formattedAnswer = aiAnswer.reply.replace(/\n/g, "<br />");

      if (editorRef.current) {
        console.log("here!");
        const editor = editorRef.current as any;
        editor.setContent(formattedAnswer);
      }
      toast({
        description: "AI successfully generate answer. Check editor window.",
      });
    } catch (error) {
      toast({
        title: "Ooops...",
        description: "Something went wrong. Please try again later",
      });
    } finally {
      setIsSubmittingAI(false);
    }
  };

  return (
    <div>
      <div
        className={
          "flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2"
        }
      >
        <h4 className={"paragraph-semibold text-dark400_light800"}>
          Write your answer here
        </h4>
        <Button
          className={
            "btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500 "
          }
          disabled={isSubmittingAI || !JSON.parse(userId)}
          onClick={handleCreateAIAnswer}
        >
          <Image
            src={Shrink}
            alt={"shrink"}
            width={12}
            height={12}
            className={"object-contain"}
          />
          {isSubmittingAI ? "Generating..." : "Generate an AI answer"}
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateAnswer)}
          className=" mt-6 flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className={"flex w-full flex-col gap-3"}>
                <FormControl className={"mt-3.5"}>
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    // @ts-ignore
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
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
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                    }}
                  />
                </FormControl>
                <FormMessage className={"body-regular text-red-500"} />
              </FormItem>
            )}
          />
          <div className={"flex justify-end"}>
            <Button
              type="submit"
              className={
                "primary-gradient w-fit text-white hover:cursor-pointer hover:disabled:cursor-not-allowed"
              }
              disabled={isSubmitting || !JSON.parse(userId)}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
