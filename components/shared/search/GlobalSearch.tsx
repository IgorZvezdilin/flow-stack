import { Input } from "@/components/ui/input";
import Search from "@/public/assets/icons/search.svg";
import Image from "next/image";

export default function GlobalSearch() {
  return (
    <div className="relative w-full max-w-[600px] ">
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
          placeholder="Search globally"
          value={""}
          className="paragraf-regular no-focus placeholder background-light800_darkgradient ouline-none border-none shadow-none "
        />
      </div>
    </div>
  );
}
