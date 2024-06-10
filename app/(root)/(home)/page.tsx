import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Search from "@/public/assets/icons/search.svg";
import Filter from "@/components/shared/filter/Filter";
import { HomePageFilters } from "@/constants/filters";
import HomeFilter from "@/components/shared/filter/HomeFilter";
import NoResult from "@/components/shared/noResult/NoResult";
import QuestionCard from "@/components/shared/cards/QuestionCard";
import {
  getQuestions,
  getRecommendedQuestions,
} from "@/lib/actions/question.action";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/pagination";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Home | Dev overflow",
};

export default async function Home({ searchParams }: SearchParamsProps) {
  let result;

  const { userId } = auth();
  if (searchParams.filter === "recommended") {
    if (userId) {
      result = await getRecommendedQuestions({
        searchQuery: searchParams.q,
        userId,
        page: searchParams.page ? Number(searchParams.page) : 1,
      });
    } else {
      result = {
        questions: [],
        isNext: false,
      };
    }
  } else {
    result = await getQuestions({
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: searchParams.page ? Number(searchParams.page) : 1,
    });
  }

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All questions</h1>
        <Link href={"/ask-question"} className="flex justify-end max-sm:w-full">
          <Button className=" primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a question
          </Button>
        </Link>
      </div>
      <div className=" mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc={Search}
          placeholder="Search for a question"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilter />

      <div className=" mt-10 flex w-full flex-col gap-6 ">
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
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
            title="There’s no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
          discussion. our query could be the next big thing others learn from. Get
          involved! 💡"
            link="/ask-question"
            linkTitle="Ask a question"
          />
        )}
      </div>
      <Pagination
        pageNumber={searchParams.page ? Number(searchParams.page) : 1}
        isNext={result.isNext}
      />
    </>
  );
}
