"use server";
import {
  CreateAnswerParams,
  GetAnswersParams,
} from "@/lib/actions/shared.types";
import { connectToDatabase } from "@/lib/mongoose";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await connectToDatabase();

    const { author, question, content, path } = params;
    const answer = await Answer.create({
      author,
      question,
      content,
    });

    await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getAllAnswers(params: GetAnswersParams) {
  try {
    await connectToDatabase();

    const { questionId } = params;
    const answers = await Answer.find({
      question: questionId,
    })
      .populate("author", "_id clerkId name picture ")
      .sort({ createdAt: -1 });

    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
