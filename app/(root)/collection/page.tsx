import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import Search from "@/public/assets/icons/search.svg";
import Filter from "@/components/shared/filter/Filter";
import { QuestionFilters } from "@/constants/filters";
import NoResult from "@/components/shared/noResult/NoResult";
import QuestionCard from "@/components/shared/cards/QuestionCard";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { SearchParamsProps } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collection | Dev overflow",
};
export default async function Collection({ searchParams }: SearchParamsProps) {
  const { userId } = auth();
  let questions;
  if (userId) {
    const { questions: questionsArr } = await getSavedQuestions({
      clerkId: userId,
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: searchParams.page ? Number(searchParams.page) : 1,
    });
    questions = questionsArr;
  }

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className=" mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/collection"
          iconPosition="left"
          imgSrc={Search}
          placeholder="Search for a question"
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
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
            title="There’s no saved question to show"
            description="Find questions your are interested! 🚀 Our query could be the next big thing others learn from. Get
          involved! 💡"
            link="/"
            linkTitle="Save question"
          />
        )}
      </div>
    </>
  );
}
