import Filter from "@/components/shared/filter/Filter";
import { AnswerFilters } from "@/constants/filters";
import { getAllAnswers } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimeStamp } from "@/lib/utils";
import ParseHTML from "@/components/shared/parseHTML/parseHTML";
import Vote from "@/components/shared/vote/Vote";

interface IAnswerList {
  questionId: string;
  userId: string;
  page?: number;
  filter?: number;
}
const AnswerList = async ({
  questionId,
  userId,
  page,
  filter,
}: IAnswerList) => {
  const { answers } = await getAllAnswers({ questionId });

  console.log("this is answers", answers);

  return (
    <div className={" mt-11"}>
      <div className={"flex items-center justify-between"}>
        <h3 className={"primary-text-gradient "}> {answers.length} Answers</h3>
        <Filter filters={AnswerFilters} />
      </div>
      <div>
        {answers.map((answer) => (
          <article key={answer._id} className={"light-border border-b py-10"}>
            <div className={"flex items-center justify-between"}>
              <div
                className={
                  "mb-8  flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2"
                }
              >
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className={"flex flex-1 items-start gap-1 sm:items-center"}
                >
                  <Image
                    src={answer.author.picture}
                    alt={"profile"}
                    width={16}
                    height={16}
                    className={"rounded-full object-contain pb-0.5"}
                  />
                  <div className={" flex flex-col sm:flex-row sm:items-center"}>
                    <p className={"body-semibold text-dark300_light700"}>
                      {answer.author.name}
                    </p>
                    <p
                      className={
                        "small-regular text-light400_light500 ml-1.5  line-clamp-1 sm:items-center"
                      }
                    >
                      answered {getTimeStamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>
                <div className={" flex justify-end"}>
                  <Vote
                    type={"Answer"}
                    itemId={JSON.stringify(answer._id)}
                    userId={JSON.stringify(userId)}
                    upvotes={answer.upvotes.length}
                    hasUpvoted={answer.upvotes.includes(userId)}
                    downvotes={answer.downvotes.length}
                    hasDownvoted={answer.downvotes.includes(userId)}
                  />
                </div>
              </div>
            </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
    </div>
  );
};

export default AnswerList;
