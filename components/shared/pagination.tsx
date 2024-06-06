"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface IPagination {
  pageNumber: number;
  isNext: boolean;
}

const Pagination = ({ pageNumber, isNext }: IPagination) => {
  const router = useRouter();
  const params = useSearchParams();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const direction = event.currentTarget.value;
    const nextPageNumber =
      direction === "prev" ? pageNumber - 1 : pageNumber + 1;

    const newUrl = formUrlQuery({
      params: params.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    router.push(newUrl);
  };

  if (!isNext && pageNumber === 1) return null;

  return (
    <div className={"mt-10 flex w-full items-center justify-center gap-2"}>
      <Button
        className={
          "light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        }
        onClick={handleClick}
        disabled={pageNumber === 1}
        value={"prev"}
      >
        <p className={"body-medium text-dark200_light800 "}>Prev</p>
      </Button>
      <div
        className={
          " flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2"
        }
      >
        <p className={"body-semibold text-light-900"}>{pageNumber}</p>
      </div>
      <Button
        className={
          "light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        }
        onClick={handleClick}
        disabled={!isNext}
        value={"next"}
      >
        <p className={"body-medium text-dark200_light800 "}>Next</p>
      </Button>
    </div>
  );
};

export default Pagination;