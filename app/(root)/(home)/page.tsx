import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Search from "@/public/assets/icons/search.svg";
import Filter from "@/components/shared/filter/Filter";
import { HomePageFilters } from "@/constants/filters";
import HomeFilter from "@/components/shared/filter/HomeFilter";
import NoResult from "@/components/shared/noResult/NoResult";
import QuestionCard from "@/components/shared/questionCard/QuestionCard";

export default function Home() {
  const questions = [
    {
      _id: 1,
      title: "How to use TypeScript with React?",
      tags: [
        { _id: 101, name: "typescript" },
        { _id: 102, name: "react" },
      ],
      author: {
        _id: 201,
        name: "John Doe",
        picture: "https://example.com/john-doe.jpg",
      },
      upvotes: 15,
      views: 12000000,
      answers: 5,
      createdAt: new Date("2024-01-15T12:30:00Z"),
    },
    {
      _id: 2,
      title: "Best practices for styling in React applications?",
      tags: [
        { _id: 103, name: "react" },
        { _id: 104, name: "css" },
      ],
      author: {
        _id: 202,
        name: "Jane Smith",
        picture: "https://example.com/jane-smith.jpg",
      },
      upvotes: 28,
      views: 85,
      answers: 8,
      createdAt: new Date("2022-03-10T15:45:00Z"),
    },
    {
      _id: 3,
      title: "How to deploy a Node.js application to Heroku?",
      tags: [
        { _id: 105, name: "nodejs" },
        { _id: 106, name: "heroku" },
      ],
      author: {
        _id: 203,
        name: "Mike Johnson",
        picture: "https://example.com/mike-johnson.jpg",
      },
      upvotes: 22,
      views: 95,
      answers: 7,
      createdAt: new Date("2022-04-05T09:15:00Z"),
    },
    {
      _id: 4,
      title: "Introduction to GraphQL and its advantages",
      tags: [
        { _id: 107, name: "graphql" },
        { _id: 108, name: "api" },
      ],
      author: {
        _id: 204,
        name: "Emily Brown",
        picture: "https://example.com/emily-brown.jpg",
      },
      upvotes: 35,
      views: 150,
      answers: 12,
      createdAt: new Date("2022-05-20T18:20:00Z"),
    },
    {
      _id: 5,
      title: "Handling state in React: Redux vs Context API",
      tags: [
        { _id: 109, name: "react" },
        { _id: 110, name: "redux" },
      ],
      author: {
        _id: 205,
        name: "David Wilson",
        picture: "https://example.com/david-wilson.jpg",
      },
      upvotes: 18,
      views: 110,
      answers: 6,
      createdAt: new Date("2022-06-08T14:10:00Z"),
    },
  ];

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
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
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
    </>
  );
}
