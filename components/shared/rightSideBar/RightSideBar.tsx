import Link from "next/link";
import Image from "next/image";
import RightArrow from "@/public/assets/icons/arrow-right.svg";
import RenderTag from "../renderTag/RenderTag";

export default function RightSideBar() {
  const hotQuestions = [
    {
      id: 1,
      title: "hot questions",
    },
    {
      id: 2,
      title: "Looooooooooogn orgkln hot questions",
    },
    {
      id: 3,
      title: ";lsmf;slmf;sflm orgkln hot questions",
    },
    {
      id: 4,
      title: "e;lkgje orgkln hot questions",
    },
    {
      id: 5,
      title: "lfksgns;flkgm s;dlgkm",
    },
  ];
  const popularTags = [
    {
      id: 1,
      title: "JavaScript",
      questions: 5,
    },
    {
      id: 2,
      title: "ReactJS",
      questions: 3,
    },
    {
      id: 3,
      title: "NextJS",
      questions: 2,
    },
    {
      id: 4,
      title: "VueJS",
      questions: 1,
    },
    {
      id: 5,
      title: "Angular",
      questions: 3,
    },
  ];
  return (
    <section className=" background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen flex-col overflow-y-hidden border-l p-6 pt-28 shadow-light-300 max-xl:hidden lg:w-[350px] dark:shadow-none">
      <div>
        <h3 className=" h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question, index) => {
            return (
              <Link
                key={index}
                href={`/questions/${question.id}`}
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
                _id={tag.id}
                name={tag.title}
                totalQuestions={tag.questions}
                showCount
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
