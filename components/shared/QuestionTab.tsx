import { SearchParamsProps } from "@/types";
import { getUserQuestions } from "@/lib/actions/user.action";
import QuestionCard from "@/components/shared/cards/QuestionCard";

interface IQuestionTab extends SearchParamsProps {
  userId: string;
  clerkId: string | null;
}

export default async function QuestionTab({
  searchParams,
  userId,
  clerkId,
}: IQuestionTab) {
  const { totalQuestions, questions } = await getUserQuestions({ userId });

  return (
    <div className={"flex flex-col gap-2"}>
      {questions.map((item) => (
        <QuestionCard
          key={item._id}
          title={item.title}
          clerkId={clerkId}
          _id={item._id}
          views={item.views}
          upvotes={item.upvotes.length}
          createdAt={item.createdAt}
          answers={item.answers.length}
          tags={item.tags}
          author={item.author}
        />
      ))}
    </div>
  );
}
