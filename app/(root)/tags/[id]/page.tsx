import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import Search from "@/public/assets/icons/search.svg";
import { getQuestionsByTagId } from "@/lib/actions/tag.action";
import NoResult from "@/components/shared/noResult/NoResult";
import QuestionCard from "@/components/shared/cards/QuestionCard";
import { URLProps } from "@/types";

const Page = async ({ params, searchParams }: URLProps) => {
  const { name, questions } = await getQuestionsByTagId({
    tagId: params.id,
    searchQuery: searchParams.q,
    page: searchParams.page ? Number(searchParams.page) : 1,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{name}</h1>
      <div className=" mt-11 w-full">
        <LocalSearchBar
          route={`/tags/${params.id}`}
          iconPosition="left"
          imgSrc={Search}
          placeholder="Search for a tag question"
          otherClasses="flex-1"
        />
      </div>
      <div className=" mt-10 flex w-full flex-col gap-6 ">
        {questions.length > 0 ? (
          questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes.length}
              views={question.views}
              answers={question.answers.length}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There’s no tag question to show"
            description="Find questions your are interested! 🚀 Our query could be the next big thing others learn from. Get
          involved! 💡"
            link="/"
            linkTitle="Save question"
          />
        )}
      </div>
    </>
  );
};

export default Page;
