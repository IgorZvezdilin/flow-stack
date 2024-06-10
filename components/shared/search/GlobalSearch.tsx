"use client";

import { Input } from "@/components/ui/input";
import Search from "@/public/assets/icons/search.svg";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { debounce, formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import GlobalResult from "@/components/shared/search/GlobalResult";

export default function GlobalSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const query = searchParams.get("global");
  const [search, setSearch] = useState<string>(query ?? "");

  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    setIsOpen(false);
    setSearch("");

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [pathname]);

  const updateQuery = debounce((value: string) => {
    if (value) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "global",
        value,
      });

      router.push(newUrl, { scroll: false });
    } else {
      if (query) {
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["q", "global"],
        });
        router.push(newUrl, { scroll: false });
      }
    }
  }, 500);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOpen) setIsOpen(true);
    if (event.currentTarget.value === "" && isOpen) setIsOpen(false);
    setSearch(event.currentTarget.value);
    updateQuery(event.currentTarget.value);
  };

  return (
    <div className="relative w-full max-w-[600px]" ref={searchContainerRef}>
      <div className=" background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
        <Image
          src={Search}
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          type="text"
          value={search}
          onChange={handleChange}
          placeholder="Search globally"
          className="paragraf-regular text-dark400_light800 no-focus placeholder ouline-none border-none bg-transparent shadow-none "
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
}
