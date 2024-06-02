import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.action";
import { getQuestionById } from "@/lib/actions/question.action";
import QuestionForm from "@/components/shared/forms/QuestionForm";

interface IPageProps {
  params: {
    [key: string]: string;
  };
}
const Page = async ({ params }: IPageProps) => {
  const { userId } = auth();
  if (!userId) return;
  const mongoUser = await getUserById({ userId });
  const { question } = await getQuestionById({ questionId: params.id });

  return (
    <>
      <h1 className={"h1-bold text-dark100_light900"}>Edit Question</h1>
      <div className={"mt-9"}>
        <QuestionForm
          mongoUserId={JSON.stringify(mongoUser._id)}
          type={"Edit"}
          questionDetails={JSON.stringify(question)}
        />
      </div>
    </>
  );
};

export default Page;
