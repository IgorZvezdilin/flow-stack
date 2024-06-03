"use server";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "@/lib/actions/shared.types";
import { connectToDatabase } from "@/lib/mongoose";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { PipelineStage } from "mongoose";

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

    const { questionId, sortBy } = params;

    let sortQuery: PipelineStage = { $sort: { createdAt: -1 } };
    if (sortBy) {
      switch (sortBy) {
        case "highestUpvotes":
          sortQuery = {
            $sort: {
              upvotesLength: -1,
            },
          };
          break;
        case "lowestUpvotes":
          sortQuery = {
            $sort: {
              upvotesLength: 1,
            },
          };
          break;
        case "recent":
          sortQuery = {
            $sort: {
              createdAt: -1,
            },
          };
          break;
        case "old":
          sortQuery = {
            $sort: {
              createdAt: 1,
            },
          };
          break;
        default:
          break;
      }
    }

    const aggregationPipeline: PipelineStage[] = [
      {
        $match: {
          question: questionId,
        },
      },
      {
        $addFields: {
          upvotesLength: { $size: "$upvotes" },
        },
      },
      sortQuery,
      {
        $lookup: {
          from: "users", // Assuming your User model maps to 'users' collection
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $unwind: "$authorDetails",
      },
      {
        $addFields: {
          author: {
            _id: "$authorDetails._id",
            clerkId: "$authorDetails.clerkId",
            name: "$authorDetails.name",
            picture: "$authorDetails.picture",
          },
        },
      },
      {
        $project: {
          authorDetails: 0,
        },
      },
    ];

    const answers = await Answer.aggregate(aggregationPipeline);

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

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    await connectToDatabase();

    const { answerId, path } = params;
    const answer = await Answer.findById({ _id: answerId });

    await Question.updateMany(
      {
        _id: answer.question,
      },
      {
        $pull: { answers: answerId },
      },
    );
    await Interaction.deleteMany({ answer: answerId });

    await Answer.deleteOne({ _id: answerId });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
