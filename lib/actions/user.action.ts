"use server";

import { connectToDatabase } from "@/lib/mongoose";
import User from "@/database/user.model";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  UpdateUserParams,
} from "@/lib/actions/shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export async function getUseById(params: any) {
  try {
    await connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    return { user };
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
    // const { page = 1, pageSize = 10, filter, searchQuery } = params;
    const users = await User.find({}).sort({ createdAt: -1 });
    return { users };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
