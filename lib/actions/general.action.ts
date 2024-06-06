"use server";

import { SearchParams } from "@/lib/actions/shared.types";
import { connectToDatabase } from "@/lib/mongoose";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";

const searchableTypes = ["question", "tag", "user", "answer"];

export async function globalSearch(params: SearchParams) {
  try {
    await connectToDatabase();
    const { query, type } = params;

    const regexQuery = { $regex: query, $options: "i" };

    let result: any = [];

    const modelsAndTypes = [
      {
        model: Question,
        searchField: "title",
        type: "question",
      },
      {
        model: User,
        searchField: "username",
        type: "user",
      },
      {
        model: Tag,
        searchField: "name",
        type: "tag",
      },
      {
        model: Answer,
        searchField: "content",
        type: "answer",
      },
    ];

    const typeLower = type?.toLowerCase();

    if (!typeLower || !searchableTypes.includes(typeLower)) {
      // type
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({
            [searchField]: regexQuery,
          })
          .limit(2);
        result.push(
          ...queryResults.map((item) => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : item[searchField],
            type,
            id:
              type === "user"
                ? item.clerkId
                : type === "answer"
                  ? item.question
                  : item._id,
          })),
        );
      }
    } else {
      const modelInfo = modelsAndTypes.find((mnd) => mnd.type === typeLower);
      if (!modelInfo) {
        throw new Error("Invalid search type");
      }
      const queryRsult = await modelInfo.model
        .find({
          [modelInfo.searchField]: regexQuery,
        })
        .limit(8);

      result = queryRsult.map((item) => ({
        title:
          type === "answer"
            ? `Answers containing ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
              ? item.question._id
              : item._id,
      }));
    }
    return JSON.stringify(result);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
