"use server";

import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "@/lib/actions/shared.types";
import { connectToDatabase } from "@/lib/mongoose";
import Tag, { ITag } from "@/database/tag.model";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";
import User from "@/database/user.model";
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

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectToDatabase();
    const { tagId, searchQuery } = params;
    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery ? { $title: { $regex: searchQuery } } : {},
      options: {
        sort: {
          createdAt: -1,
        },
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

    if (!tag) {
      throw new Error("User not found");
    }
    return { name: tag.name, questions: tag.questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
