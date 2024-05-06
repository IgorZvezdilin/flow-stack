import Image from "next/image";
import NoResultsLight from "@/public/assets/images/light-illustration.png";
import NoResultsDark from "@/public/assets/images/dark-illustration.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface INoResult {
  title: string;
  description: string;
  link: string;
  linkTitle: string;
}

export default function NoResult({
  title,
  description,
  link,
  linkTitle,
}: INoResult) {
  return (
    <div className=" mt-10 flex w-full flex-col items-center justify-center ">
      <Image
        src={NoResultsLight}
        alt="no result illustration"
        width={270}
        height={200}
        className=" block object-contain dark:hidden"
      />
      <Image
        src={NoResultsDark}
        alt="no result illustration"
        width={270}
        height={200}
        className=" hidden object-contain dark:flex"
      />
      <h2 className=" h2-bold text-dark200_light900">{title}</h2>
      <p className=" text-dark500_light700 body-regular my-3.5 max-w-md text-center">
        {description}
      </p>
      <Link href={link}>
        <Button className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900">
          {linkTitle}
        </Button>
      </Link>
    </div>
  );
}
