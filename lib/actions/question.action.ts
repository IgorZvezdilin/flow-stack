"use server";

import { connectToDatabase } from "@/lib/mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "@/lib/actions/shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

export async function createQuestion(params: CreateQuestionParams) {
  try {
    await connectToDatabase();

    const { title, content, tags, author, path } = params;
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        {
          $setOnInsert: { name: tag },
          $push: { questions: question._id },
        },
        { upsert: true, new: true },
      );
      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(
      { _id: question._id },
      {
        $push: { tags: { $each: tagDocuments } },
      },
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getQuestions(params: GetQuestionsParams) {
  try {
    await connectToDatabase();

    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });
    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    await connectToDatabase();

    const { questionId } = params;

    const question = await Question.findOne({ _id: questionId })
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
      .sort({ createdAt: -1 });
    return { question };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    await connectToDatabase();

    const { questionId, userId, path, hasupVoted, hasdownVoted } = params;
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
        $push: { upvotes: userId },
      };
    }

    const question = await Question.findOneAndUpdate(
      { _id: questionId },
      upvoteQuery,
      { new: true },
    );

    // increment Author reputation +10
    if (!question) {
      throw new Error("Question not found");
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    await connectToDatabase();

    const { questionId, userId, path, hasupVoted, hasdownVoted } = params;
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

    const question = await Question.findOneAndUpdate(
      { _id: questionId },
      upvoteQuery,
      { new: true },
    );
    // increment Author reputation +10
    if (!question) {
      throw new Error("Question not found");
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
