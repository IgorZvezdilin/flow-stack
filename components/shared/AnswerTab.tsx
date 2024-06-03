import { SearchParamsProps } from "@/types";
import { getUserAnswers } from "@/lib/actions/user.action";
import AnswerCard from "@/components/shared/cards/AnswerCard";
import Pagination from "@/components/shared/pagination";

interface IAnswerTab extends SearchParamsProps {
  userId: string;
  clerkId: string | null;
}

export default async function AnswerTab({
  searchParams,
  userId,
  clerkId,
}: IAnswerTab) {
  const { answers, isNext } = await getUserAnswers({
    userId,
    page: searchParams.page ? Number(searchParams.page) : 1,
  });

  return (
    <div className={"flex flex-col gap-2"}>
      {answers.map((item) => (
        <AnswerCard
          key={item._id}
          question={item.question}
          clerkId={clerkId}
          _id={item._id}
          author={item.author}
          upvotes={item.upvotes.length}
          createdAt={item.createdAt}
        />
      ))}
      <Pagination
        pageNumber={searchParams.page ? Number(searchParams.page) : 1}
        isNext={isNext}
      />
    </div>
  );
}
