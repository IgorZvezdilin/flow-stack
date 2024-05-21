"use server";

import {
  GetAllTagsParams,
  GetTopInteractedTagsParams,
} from "@/lib/actions/shared.types";
import { connectToDatabase } from "@/lib/mongoose";
import Tag from "@/database/tag.model";
import Question from "@/database/question.model";
/*
import User from "@/database/user.model";
*/

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    await connectToDatabase();

    // const { userId } = params;

    // const user = await User.findById({ userId });

    return [
      { _id: 1, name: "tag1" },
      { _id: 2, name: "tag2" },
      { _id: 2, name: "tag3" },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    await connectToDatabase();
    const tags = await Tag.find({}).populate({
      path: "questions",
      model: Question,
    });
    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
