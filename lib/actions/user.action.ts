"use server";

import { FilterQuery } from "mongoose";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/database/user.model";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "@/lib/actions/shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";

export async function getUserById(params: GetUserByIdParams) {
  try {
    await connectToDatabase();
    const { userId } = params;
    return await User.findOne({ clerkId: userId });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(params: CreateUserParams) {
  try {
    await connectToDatabase();
    const user = await User.create(params);
    return { user };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    await connectToDatabase();
    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    await connectToDatabase();
    const { clerkId } = params;
    const user = await User.findOneAndDelete({ clerkId });

    /*    const userQuestionsIds = await Question.find({ author: user._id }).distinct(
      "_id",
    ); */

    await Question.deleteMany({ author: user._id });

    // TODO : delete other fields like answers, comments and etc.

    return { user };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 1 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {};
    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }
    let sortQuery = {};
    if (filter) {
      switch (filter) {
        case "new_users":
          sortQuery = { joinedAt: -1 };
          break;
        case "old_users":
          sortQuery = { joinedAt: 1 };
          break;
        case "top_contributors":
          query.answers = { reputation: -1 };
          break;
        default:
          break;
      }
    }

    const users = await User.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortQuery);

    const totalUsers = await User.countDocuments(query);

    const isNext = totalUsers > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    await connectToDatabase();
    const { userId, questionId, path } = params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    let updatedQuery;
    if (user.saved.includes(questionId)) {
      updatedQuery = { $pull: { saved: questionId } };
    } else {
      updatedQuery = { $addToSet: { saved: questionId } };
    }
    await User.findOneAndUpdate({ _id: userId }, updatedQuery, { new: true });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    await connectToDatabase();
    const { clerkId, searchQuery, filter } = params;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [{ title: { $regex: new RegExp(searchQuery, "i") } }];
    }
    let sortQuery = {};
    if (filter) {
      switch (filter) {
        case "most_recent":
          sortQuery = { createdAt: -1 };
          break;
        case "oldest":
          sortQuery = { createdAt: 1 };
          break;
        case "most_voted":
          sortQuery = { upvotes: -1 };
          break;
        case "most_viewed":
          sortQuery = { views: -1 };
          break;
        case "most_answered":
          sortQuery = { answers: -1 };
          break;
        default:
          break;
      }
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortQuery,
        populate: [
          {
            path: "tags",
            model: Tag,
            select: "_id name",
          },
          { path: "author", model: User, select: "_id clerkId name picture" },
        ],
      },
    });

    if (!user) {
      throw new Error("User not found");
    }
    return { questions: user.saved };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    await connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return {
      user,
      totalQuestions,
      totalAnswers,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    await connectToDatabase();
    const { userId } = params;

    const totalQuestions = await Question.countDocuments({ author: userId });
    const questions = await Question.find({ author: userId })
      .sort({
        views: -1,
        upvotes: -1,
      })
      .populate("tags", "_id name")
      .populate("author", "_id name picture clerkId");

    return { totalQuestions, questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    await connectToDatabase();
    const { userId } = params;

    const totalAnswers = await Answer.countDocuments({ author: userId });
    const answers = await Answer.find({ author: userId })
      .sort({
        upvotes: -1,
      })
      .populate("question", "_id title")
      .populate("author", "_id name picture clerkId");

    return { totalAnswers, answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
