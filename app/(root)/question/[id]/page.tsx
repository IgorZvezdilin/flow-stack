import { getQuestionById } from "@/lib/actions/question.action";
import Link from "next/link";
import Image from "next/image";
import Metric from "@/components/shared/metric/Metric";
import Clock from "@/public/assets/icons/clock.svg";
import { formatBigNumber, getTimeStamp } from "@/lib/utils";
import Answer from "@/public/assets/icons/message.svg";
import Eye from "@/public/assets/icons/eye.svg";
import ParseHTML from "@/components/shared/parseHTML/parseHTML";
import RenderTag from "@/components/shared/renderTag/RenderTag";
import AnswerForm from "@/components/shared/forms/Answer";
import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.action";
import AnswerList from "@/components/shared/answerList/AnswerList";
import Vote from "@/components/shared/vote/Vote";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Question | Dev overflow",
};
interface IPageProps {
  params: {
    [key: string]: string;
  };
  searchParams: { [key: string]: string };
}
const Page = async ({ params, searchParams }: IPageProps) => {
  const { question } = await getQuestionById({ questionId: params.id });

  const { userId } = auth();
  let mongoUser = {
    _id: "",
    saved: [],
  };
  if (userId) {
    mongoUser = await getUserById({ userId });
  }
  return (
    <>
      <div className={" flex-start w-full flex-col"}>
        <div
          className={
            "flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2"
          }
        >
          <Link
            href={`/profile/${question.author.clerkId}`}
            className={" flex items-center justify-start gap-1"}
          >
            <Image
              src={question.author.picture}
              className={"rounded-full"}
              alt={"profile"}
              width={22}
              height={22}
            />
            <p className={" paragraph-semibold text-dark300_light700 "}>
              {question.author.name}
            </p>
          </Link>
          <div className={"flex justify-end"}>
            <Vote
              type={"Question"}
              itemId={JSON.stringify(question._id)}
              userId={JSON.stringify(mongoUser?._id) || ""}
              upvotes={question.upvotes.length}
              hasUpvoted={question.upvotes.some(
                (_id: any) => _id.toString() === mongoUser?._id.toString(),
              )}
              downvotes={question.downvotes.length}
              hasDownvoted={question.downvotes.some(
                (_id: any) => _id.toString() === mongoUser?._id.toString(),
              )}
              hasSaved={mongoUser?.saved.some(
                (_id: any) => _id.toString() === question._id.toString(),
              )}
            />
          </div>
        </div>
        <h2
          className={
            " h2-semibold text-dark200_light900 mt-3.5 w-full text-left"
          }
        >
          {question.title}
        </h2>
      </div>
      <div className={"mb-8 mt-5 flex flex-wrap gap-4"}>
        <Metric
          imgUrl={Clock}
          alt="clock icon"
          value={` asked ${getTimeStamp(question.createdAt)}`}
          title=""
          textStyles=" small-medium text-dark400_light800"
        />
        <Metric
          imgUrl={Answer}
          alt="asnwers"
          value={formatBigNumber(question.answers.length)}
          title=" Ansvers"
          textStyles=" small-medium text-dark400_light800"
        />
        <Metric
          imgUrl={Eye}
          alt="eye"
          value={formatBigNumber(question.views)}
          title=" Views"
          textStyles=" small-medium text-dark400_light800"
        />
      </div>
      <ParseHTML data={question.content} />

      <div className={"mt-8 flex flex-wrap gap-2"}>
        {question.tags.map((tag: any) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AnswerList
        questionId={question._id}
        userId={mongoUser?._id}
        page={searchParams?.page}
        filter={searchParams?.filter}
      />

      <AnswerForm
        question={question.content}
        questionId={JSON.stringify(question._id)}
        userId={JSON.stringify(mongoUser?._id)}
      />
    </>
  );
};

export default Page;
