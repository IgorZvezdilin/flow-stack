"use client";

import Image from "next/image";
import Upvoted from "../../../public/assets/icons/upvoted.svg";
import Upvote from "../../../public/assets/icons/upvote.svg";
import Downvoted from "../../../public/assets/icons/downvoted.svg";
import Downvote from "../../../public/assets/icons/downvote.svg";
import StarFilled from "../../../public/assets/icons/star-filled.svg";
import Star from "../../../public/assets/icons/star-red.svg";
import { formatBigNumber } from "@/lib/utils";

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
  const handleSave = () => {};

  const handleVote = (action: "upvote" | "downvote") => {};

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

      <Image
        src={hasSaved ? StarFilled : Star}
        alt={"saving"}
        width={18}
        height={18}
        className={"cursor-pointer"}
        onClick={handleSave}
      />
    </div>
  );
};

export default Vote;
