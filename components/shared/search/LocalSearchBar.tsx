"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";

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
  const handleChange = () => {};

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
        placeholder={placeholder}
        onChange={handleChange}
        className=" paragraf-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none "
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
