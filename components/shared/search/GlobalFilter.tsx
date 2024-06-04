import { GlobalSearchFilters } from "@/constants/filters";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

const GlobalFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchType = searchParams.get("type");
  const [type, setType] = useState<string>(searchType ?? "");

  const handleTypeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const currentType = event.currentTarget.value;
    if (type === currentType) {
      setType("");
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["type"],
      });
      router.push(newUrl, { scroll: false });
    } else {
      setType(currentType);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: currentType,
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className={"flex items-center gap-5 px-5"}>
      <p className={"text-dark400_light900 body-medium "}>Type: </p>
      <div className={"flex gap-3"}>
        {GlobalSearchFilters.map((item) => (
          <Button
            className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize dark:text-light-800 ${type === item.value ? "bg-primary-500 text-light-900" : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500 "}`}
            key={item.value}
            value={item.value}
            onClick={handleTypeClick}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
export default GlobalFilter;
