import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/actions/user.action";
import QuestionForm from "@/components/shared/forms/QuestionForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask question | Dev overflow",
};
async function Page() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const user = await getUserById({ userId });
  return (
    <div className={" h1-bold text-dark100_light900 "}>
      Ask a Question
      <div className={"mt-9"}>
        <QuestionForm mongoUserId={JSON.stringify(user._id)} />
      </div>
    </div>
  );
}

export default Page;
