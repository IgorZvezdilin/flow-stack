import { z } from "zod";

export const QuestionSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(20),
  tags: z.array(z.string().min(1).max(15)).min(1).max(10),
});

export const AnswerSchema = z.object({
  answer: z.string().min(20),
});

export const ProfileSchema = z.object({
  name: z.string().min(5).max(50),
  username: z.string().min(5).max(30),
  portfolioWebsite: z.string().url().optional(),
  location: z.string().min(10).max(50).optional(),
  bio: z.string().min(10).max(150).optional(),
});
