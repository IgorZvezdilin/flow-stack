import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.action";
import ProfileForm from "@/components/shared/forms/ProfileForm";

interface IPageProps {
  params: {
    [key: string]: string;
  };
}
const Page = async ({ params }: IPageProps) => {
  const { userId } = auth();
  if (!userId) return;
  const mongoUser = await getUserById({ userId });

  return (
    <>
      <h1 className={"h1-bold text-dark100_light900"}>Edit Profile</h1>
      <div className={"mt-9"}>
        <ProfileForm
          clerkId={userId}
          profileDetails={JSON.stringify(mongoUser)}
        />
      </div>
    </>
  );
};

export default Page;
