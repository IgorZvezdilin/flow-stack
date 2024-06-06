"use server";

import { connectToDatabase } from "@/lib/mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "@/lib/actions/shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { FilterQuery } from "mongoose";

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

    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocuments,
    });

    await User.findByIdAndUpdate({ _id: author }, { $inc: { reputation: 5 } });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    await connectToDatabase();

    const { questionId, title, content, path } = params;
    const question = await Question.findById({ _id: questionId }).populate(
      "tags",
    );

    question.title = title;
    question.content = content;

    question.save();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getQuestions(params: GetQuestionsParams) {
  try {
    await connectToDatabase();

    const { searchQuery, filter, page, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        {
          title: { $regex: new RegExp(searchQuery, "i") },
        },
        {
          content: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }

    let sortQuery = {};

    if (filter) {
      switch (filter) {
        case "newest":
          sortQuery = { createdAt: -1 };
          break;
        case "frequent":
          sortQuery = { views: -1 };
          break;
        case "unanswered":
          query.answers = { $size: 0 };
          break;
        case "recommended":
          break;
        default:
          break;
      }
    }

    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortQuery);

    const totalQuestions = await Question.countDocuments(query);

    const isNext = totalQuestions > skipAmount + questions.length;

    return { questions, isNext };
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
    let upvoteQuery;
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

    await User.findByIdAndUpdate(
      { _id: userId },
      { $inc: { reputation: hasupVoted ? -2 : 2 } },
    );

    await User.findByIdAndUpdate(
      { _id: question.author._id },
      { $inc: { reputation: hasupVoted ? -10 : 10 } },
    );

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
    let upvoteQuery;

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

    await User.findByIdAndUpdate(
      { _id: userId },
      { $inc: { reputation: hasdownVoted ? 1 : -1 } },
    );

    await User.findByIdAndUpdate(
      { _id: question.author._id },
      { $inc: { reputation: hasdownVoted ? 10 : -10 } },
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    await connectToDatabase();

    const { questionId, path } = params;
    await Question.deleteOne({
      _id: questionId,
    });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await User.updateMany(
      { saved: questionId },
      {
        $pull: { saved: questionId },
      },
    );
    await Tag.updateMany(
      { questions: questionId },
      {
        $pull: { questions: questionId },
      },
    );
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getHotQuestions() {
  try {
    await connectToDatabase();

    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ views: -1, upvotes: -1 })
      .limit(5);
    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
