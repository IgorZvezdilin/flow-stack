"use server";

import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "@/lib/actions/shared.types";
import { connectToDatabase } from "@/lib/mongoose";
import Tag, { ITag } from "@/database/tag.model";
import Question from "@/database/question.model";
import { FilterQuery, PipelineStage } from "mongoose";
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
    const { searchQuery, filter } = params;

    const query: PipelineStage[] = [];

    if (searchQuery) {
      query.push({
        $match: {
          name: { $regex: new RegExp(searchQuery, "i") },
        },
      });
    }
    let sortQuery: PipelineStage = { $sort: {} };
    if (filter) {
      switch (filter) {
        case "popular":
          sortQuery = {
            $sort: {
              questionsLength: -1,
            },
          };
          break;
        case "recent":
          sortQuery = {
            $sort: {
              createdOn: -1,
            },
          };
          break;
        case "name":
          sortQuery = {
            $sort: {
              name: -1,
            },
          };
          break;
        case "old":
          sortQuery = {
            $sort: {
              createdOn: 1,
            },
          };
          break;
        default:
          break;
      }
    }

    const aggregationPipeline: PipelineStage[] = [
      ...query,
      {
        $addFields: {
          questionsLength: { $size: "$questions" },
        },
      },
      sortQuery,
      {
        $lookup: {
          from: "questions", // Assuming your Question model maps to 'questions' collection
          localField: "questions",
          foreignField: "_id",
          as: "questions",
        },
      },
      {
        $project: {
          questionsLength: 0,
        },
      },
    ];

    await connectToDatabase();
    const tags = await Tag.aggregate(aggregationPipeline);
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

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ title: { $regex: new RegExp(searchQuery, "i") } }];
    }

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: query,
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

export async function getPopularTags() {
  try {
    await connectToDatabase();

    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);

    return { popularTags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
