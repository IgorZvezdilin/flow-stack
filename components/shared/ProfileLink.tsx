import Image from "next/image";
import Link from "next/link";

interface IProfileLink {
  imageUrl: string;
  href?: string;
  title: string;
}
export default function ProfileLink({ imageUrl, href, title }: IProfileLink) {
  return (
    <div className={"flex-center gap-1"}>
      <Image src={imageUrl} alt={"icon"} width={20} height={20} />
      {href ? (
        <Link
          href={href}
          target={"_blank"}
          className={"paragraph-medium text-accent-blue"}
        >
          {title}
        </Link>
      ) : (
        <p className={" paragraph-medium text-dark400_light700"}>{title}</p>
      )}
    </div>
  );
}
