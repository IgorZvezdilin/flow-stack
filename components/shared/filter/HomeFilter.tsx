"use client";

import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { formUrlQuery } from "@/lib/utils";

export default function HomeFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentFilter = searchParams.get("filter");
  const [isActive, setIsActive] = useState(currentFilter);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value:
        event.currentTarget.value === isActive
          ? null
          : event.currentTarget.value,
    });
    console.log(newUrl);
    router.push(newUrl, { scroll: false });
    setIsActive(
      event.currentTarget.value === isActive ? "" : event.currentTarget.value,
    );
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((filter) => {
        return (
          <Button
            key={filter.value}
            value={filter.value}
            onClick={handleClick}
            className={` body-medium rounded-lg px-6 py-3 capitalize shadow-none ${isActive === filter.value ? " bg-primary-100 text-primary-500" : " bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"}`}
          >
            {filter.name}
          </Button>
        );
      })}
    </div>
  );
}
