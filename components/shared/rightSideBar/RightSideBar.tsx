import Link from "next/link";
import Image from "next/image";
import RightArrow from "@/public/assets/icons/arrow-right.svg";
import RenderTag from "../renderTag/RenderTag";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getPopularTags } from "@/lib/actions/tag.action";

export default async function RightSideBar() {
  const { questions } = await getHotQuestions();
  const { popularTags } = await getPopularTags();

  return (
    <section className=" background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen flex-col overflow-y-hidden border-l p-6 pt-28 shadow-light-300 max-xl:hidden lg:w-[350px] dark:shadow-none">
      <div>
        <h3 className=" h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {questions.map((question: any, index: number) => {
            return (
              <Link
                key={index}
                href={`/question/${question.id}`}
                className="flex cursor-pointer items-center justify-between gap-7"
              >
                <p className=" body-medium text-dark500_light700">
                  {question.title}
                </p>
                <Image
                  src={RightArrow}
                  alt=""
                  width={20}
                  height={20}
                  className="invert-colors"
                />
              </Link>
            );
          })}
        </div>
      </div>
      <div className=" mt-16">
        <h3 className=" h3-bold text-dark200_light900">Popular Tags</h3>
        <div className=" mt-7 flex flex-col gap-4">
          {popularTags.map((tag, index) => {
            return (
              <RenderTag
                key={index}
                _id={tag._id}
                name={tag.name}
                totalQuestions={tag.numberOfQuestions}
                showCount
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
