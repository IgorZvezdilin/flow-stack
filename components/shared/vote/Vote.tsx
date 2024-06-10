"use client";

import Image from "next/image";
import Upvoted from "../../../public/assets/icons/upvoted.svg";
import Upvote from "../../../public/assets/icons/upvote.svg";
import Downvoted from "../../../public/assets/icons/downvoted.svg";
import Downvote from "../../../public/assets/icons/downvote.svg";
import StarFilled from "../../../public/assets/icons/star-filled.svg";
import Star from "../../../public/assets/icons/star-red.svg";
import { formatBigNumber } from "@/lib/utils";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { usePathname } from "next/navigation";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { useEffect } from "react";
import { viewQuestion } from "@/lib/actions/interaction.action";
import { toast } from "@/components/ui/use-toast";

interface IVote {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasUpvoted: boolean;
  downvotes: number;
  hasDownvoted: boolean;
  hasSaved?: boolean;
}
const Vote = ({
  type,
  itemId,
  userId,
  upvotes,
  hasUpvoted,
  downvotes,
  hasDownvoted,
  hasSaved,
}: IVote) => {
  const pathName = usePathname();
  const handleSave = async () => {
    if (JSON.parse(userId)) {
      await toggleSaveQuestion({
        userId: JSON.parse(userId),
        questionId: JSON.parse(itemId),
        path: pathName,
      });
      toast({
        title: `Save question ${!hasSaved ? "successfully" : "removed"} `,
        variant: !hasSaved ? "default" : "destructive",
      });
    } else {
      toast({
        title: "Please log in.",
        description: "You must be logged in to perform this action",
      });
    }
  };

  const handleVote = async (action: "upvote" | "downvote") => {
    if (JSON.parse(userId)) {
      if (action === "upvote") {
        if (type === "Question") {
          await upvoteQuestion({
            userId: JSON.parse(userId),
            questionId: JSON.parse(itemId),
            hasupVoted: hasUpvoted,
            hasdownVoted: hasDownvoted,
            path: pathName,
          });
        }
        if (type === "Answer") {
          await upvoteAnswer({
            userId: JSON.parse(userId),
            answerId: JSON.parse(itemId),
            hasupVoted: hasUpvoted,
            hasdownVoted: hasDownvoted,
            path: pathName,
          });
        }
        toast({
          title: `Upvote ${!hasUpvoted ? "successfully" : "removed"} `,
          variant: !hasUpvoted ? "default" : "destructive",
        });
      }
      if (action === "downvote") {
        if (type === "Question") {
          await downvoteQuestion({
            userId: JSON.parse(userId),
            questionId: JSON.parse(itemId),
            hasupVoted: hasUpvoted,
            hasdownVoted: hasDownvoted,
            path: pathName,
          });
        }
        if (type === "Answer") {
          await downvoteAnswer({
            userId: JSON.parse(userId),
            answerId: JSON.parse(itemId),
            hasupVoted: hasUpvoted,
            hasdownVoted: hasDownvoted,
            path: pathName,
          });
        }
        toast({
          title: `Downvote ${!hasDownvoted ? "successfully" : "removed"} `,
          variant: !hasDownvoted ? "default" : "destructive",
        });
      }
    } else {
      toast({
        title: "Please log in.",
        description: "You must be logged in to perform this action",
      });
    }
  };

  useEffect(() => {
    const viewQuestionAsync = async () => {
      if (type === "Question") {
        await viewQuestion({
          userId: userId ? JSON.parse(userId) : undefined,
          questionId: JSON.parse(itemId),
        });
      }
    };
    viewQuestionAsync();
  }, [itemId, type, userId]);

  return (
    <div className={"flex gap-5"}>
      <div className={"flex-center gap-2.5"}>
        <div className={"flex-center gap-1.5"}>
          <Image
            src={hasUpvoted ? Upvoted : Upvote}
            alt={"upvote"}
            width={18}
            height={18}
            className={"cursor-pointer"}
            onClick={() => handleVote("upvote")}
          />
          <div
            className={
              "flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1"
            }
          >
            <p className={" subtle-medium text-dark400_light900"}>
              {formatBigNumber(upvotes)}
            </p>
          </div>
        </div>
        <div className={"flex-center gap-1.5"}>
          <Image
            src={hasDownvoted ? Downvoted : Downvote}
            alt={"downvote"}
            width={18}
            height={18}
            className={"cursor-pointer"}
            onClick={() => handleVote("downvote")}
          />
          <div
            className={
              "flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1"
            }
          >
            <p className={" subtle-medium text-dark400_light900"}>
              {formatBigNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      {type === "Question" && (
        <Image
          src={hasSaved ? StarFilled : Star}
          alt={"saving"}
          width={18}
          height={18}
          className={"cursor-pointer"}
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Vote;
