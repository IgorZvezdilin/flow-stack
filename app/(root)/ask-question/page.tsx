import Question from "@/components/shared/forms/Question";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getUseById } from "@/lib/actions/user.action";

async function Page() {
  // const { userId } = auth();
  const userId = "clerk123456";
  if (!userId) redirect("/sign-in");
  const mongoUser = await getUseById({ userId });
  return (
    <div className={" h1-bold text-dark100_light900 "}>
      Ask a Question
      <div className={"mt-9"}>
        <Question mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </div>
  );
}

export default Page;
