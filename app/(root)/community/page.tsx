import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import Search from "@/public/assets/icons/search.svg";
import Filter from "@/components/shared/filter/Filter";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import Link from "next/link";
import UserCard from "@/components/shared/cards/UserCard";
import { SearchParamsProps } from "@/types";

const Page = async ({ searchParams }: SearchParamsProps) => {
  const { users } = await getAllUsers({
    searchQuery: searchParams.q,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className=" mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/community"
          iconPosition="left"
          imgSrc={Search}
          placeholder="Search for an amaizing minds"
          otherClasses="flex-1"
        />
        <Filter
          filters={UserFilters}
          otherClasses="min-h-[38px] sm:min-w-[170px]"
        />
      </div>
      <section className={"mt-12 flex flex-wrap gap-4"}>
        {users.length > 0 ? (
          users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div
            className={
              "mt -2 paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center"
            }
          >
            <p>no users yet</p>
            <Link
              href={"/sign-up"}
              className={"tex mt-1 font-bold text-accent-blue"}
            >
              Join to be the first!
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default Page;
