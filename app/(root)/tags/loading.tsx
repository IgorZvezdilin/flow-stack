import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">Tags</h1>

      <div className="mb-12 mt-11 flex flex-wrap items-center justify-between gap-5">
        <Skeleton className="h-14 flex-1 bg-light-700/50 dark:bg-dark-400/50" />
        <Skeleton className="h-14 w-28 bg-light-700/50 dark:bg-dark-400/50" />
      </div>

      <div className="flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <Skeleton
            key={item}
            className="h-60 w-full rounded-2xl bg-light-700/50 sm:w-[260px] dark:bg-dark-400/50"
          />
        ))}
      </div>
    </section>
  );
};

export default Loading;
