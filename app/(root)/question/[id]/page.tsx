import { getQuestionById } from "@/lib/actions/question.action";
import Link from "next/link";
import Image from "next/image";
import Metric from "@/components/shared/metric/Metric";
import Clock from "@/public/assets/icons/clock.svg";
import { formatBigNumber, getTimeStamp } from "@/lib/utils";
import Answer from "@/public/assets/icons/message.svg";
import Eye from "@/public/assets/icons/eye.svg";
import ParseHTML from "@/components/shared/parseHTML/parseHTML";

interface IPageProps {
  params: {
    [key: string]: string;
  };
}
const Page = async ({ params }: IPageProps) => {
  const { question } = await getQuestionById({ questionId: params.id });
  console.log(question);
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
          <div className={"flex justify-end"}>VOTING</div>
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
    </>
  );
};

export default Page;
