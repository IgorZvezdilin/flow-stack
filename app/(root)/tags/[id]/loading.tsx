import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <Skeleton className="h-12 w-52 bg-light-700/50 dark:bg-dark-400/50" />

      <Skeleton className="mb-12 mt-11 h-14 w-full bg-light-700/50 dark:bg-dark-400/50" />

      <div className="mt-10 flex flex-col gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <Skeleton
            key={item}
            className="h-48 w-full rounded-xl bg-light-700/50 dark:bg-dark-400/50"
          />
        ))}
      </div>
    </section>
  );
};

export default Loading;
