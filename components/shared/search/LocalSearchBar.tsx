"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { debounce, formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

interface ILocalSearchBar {
  route: string;
  iconPosition: "left" | "right";
  imgSrc: any;
  placeholder: string;
  otherClasses: string;
}

export default function LocalSearchBar({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: ILocalSearchBar) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [search, setSearch] = useState<string>(query ?? "");

  const updateQuery = debounce((value: string) => {
    if (value) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "q",
        value,
      });

      router.push(newUrl, { scroll: false });
    } else {
      if (pathname === route) {
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["q"],
        });
        router.push(newUrl, { scroll: false });
      }
    }
  }, 500);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
    updateQuery(event.currentTarget.value);
  };

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          width={24}
          height={24}
          alt="search"
          className=" cursor-pointer"
        />
      )}
      <Input
        type="text"
        value={search}
        placeholder={placeholder}
        onChange={handleChange}
        className=" paragraf-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none "
      />
      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          width={24}
          height={24}
          alt="search"
          className=" cursor-pointer"
        />
      )}
    </div>
  );
}
