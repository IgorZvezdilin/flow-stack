"use server";
import {
  AnswerVoteParams,
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

    await Question.findByIdAndUpdate(
      { _id: question },
      {
        $push: { answers: answer._id },
      },
    );

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

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    await connectToDatabase();
    const { answerId, userId, path, hasupVoted, hasdownVoted } = params;
    let upvoteQuery = {};
    if (hasupVoted) {
      upvoteQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      upvoteQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      upvoteQuery = {
        $addToSet: { upvotes: userId },
      };
    }

    const answer = await Answer.findOneAndUpdate(
      { _id: answerId },
      upvoteQuery,
      {
        new: true,
      },
    );
    // increment Author reputation +10
    if (!answer) {
      throw new Error("Answer not found");
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    await connectToDatabase();

    const { answerId, userId, path, hasupVoted, hasdownVoted } = params;
    let upvoteQuery = {};

    if (hasdownVoted) {
      upvoteQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      upvoteQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      upvoteQuery = {
        $addToSet: { downvotes: userId },
      };
    }

    const answer = await Answer.findOneAndUpdate(
      { _id: answerId },
      upvoteQuery,
      {
        new: true,
      },
    );
    // increment Author reputation +10
    if (!answer) {
      throw new Error("Answer not found");
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
