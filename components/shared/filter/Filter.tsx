"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface IFilter {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

export default function Filter({
  filters,
  otherClasses,
  containerClasses,
}: IFilter) {
  const params = useSearchParams();
  const currentFilter = params.get("filter") ?? undefined;
  const router = useRouter();
  const handleUpdateFilter = (value: string) => {
    const newUrl = formUrlQuery({
      params: params.toString(),
      key: "filter",
      value,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={` relative ${containerClasses}`}>
      <Select defaultValue={currentFilter} onValueChange={handleUpdateFilter}>
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 no-focus px-5 py-2.5 outline-none`}
        >
          <div className=" no-focus line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>
        <SelectContent className=" background-light800_dark300 text-dark500_light700 border-none outline-none">
          <SelectGroup>
            {filters.map((filter) => {
              return (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.name}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
