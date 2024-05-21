import { z } from "zod";

export const QuestionSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(20),
  tags: z.array(z.string().min(1).max(15)).min(1).max(10),
});

export const AnswerSchema = z.object({
  answer: z.string().min(20),
});
