import Link from "next/link";
import Image from "next/image";
import { getTopInteractedTags } from "@/lib/actions/tag.action";
import { Badge } from "@/components/ui/badge";
import RenderTag from "@/components/shared/renderTag/RenderTag";

interface IUser {
  user: {
    id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}
const UserCard = async ({ user }: IUser) => {
  const interactedTag = await getTopInteractedTags({ userId: user.id });
  return (
    <article
      className={
        "background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8 max-xs:max-w-full xs:w-[260px]"
      }
    >
      <Link
        href={`/users/${user.clerkId}`}
        className={"shadow-light100_darknone flex w-full flex-col items-center"}
      >
        <Image
          src={user.picture}
          alt={"user profile picture"}
          width={100}
          height={100}
          className={"rounded-full"}
        />
        <div className={" mt-4 text-center"}>
          <h3 className={"h3-bold text-dark200_light900 line-clamp-1"}>
            {user.name}
          </h3>
          <p className={"body-regular text-dark500_light500 mt-2"}>
            @{user.username}
          </p>
        </div>
      </Link>
      <div className={"mt-5"}>
        {interactedTag.length > 0 ? (
          <div className={"flex items-center gap-2"}>
            {interactedTag.map((tag) => (
              <RenderTag key={tag.name} _id={tag._id} name={tag.name} />
            ))}
          </div>
        ) : (
          <Badge>No tags yet</Badge>
        )}
      </div>
    </article>
  );
};

export default UserCard;
