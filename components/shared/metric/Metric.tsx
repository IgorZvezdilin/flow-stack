import Image from "next/image";
import Link from "next/link";

interface IMetric {
  imgUrl: string;
  alt: string;
  value: number | string;
  title: string;
  textStyles: string;
  href?: string;
  isAuthor?: boolean;
}

export default function Metric({
  imgUrl,
  alt,
  value,
  title,
  textStyles,
  href,
  isAuthor,
}: IMetric) {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        width={18}
        height={18}
        alt={alt}
        className={` object-contain ${href ? "rounded-full" : ""}`}
      />
      <p className={` ${textStyles} mt-[3px] flex items-center gap-1`}>
        {value}
        <span
          className={` small-regular line-clamp-1 ${isAuthor ? "max-sm:hidden" : ""}`}
        >
          {title}
        </span>
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className=" flex-center gap-1">
        {metricContent}
      </Link>
    );
  }

  return <div className="flex-center flex-wrap gap-1">{metricContent}</div>;
}
