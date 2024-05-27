import { formatBigNumber } from "@/lib/utils";
import GoldMedal from "@/public/assets/icons/gold-medal.svg";
import SilverMedal from "@/public/assets/icons/silver-medal.svg";
import BronzeMedal from "@/public/assets/icons/bronze-medal.svg";
import Image from "next/image";

interface IStats {
  totalQuestions: number;
  totalAnswers: number;
}

interface IStatsCard {
  imgUrl: string;
  value: number;
  title: string;
}

const StatsCard = ({ imgUrl, value, title }: IStatsCard) => {
  return (
    <div
      className={
        "light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-light-200"
      }
    >
      <Image
        src={imgUrl}
        alt={"medal icon"}
        height={40}
        width={50}
        className={""}
      />
      <div>
        <p>{value}</p>
        <p className={"body-medium text-dark400_light700"}>{title}</p>
      </div>
    </div>
  );
};
export default function Stats({ totalQuestions, totalAnswers }: IStats) {
  return (
    <div className={"mt-10"}>
      <h4 className={"h3-semibold text-dark200_light900"}>Stats</h4>
      <div
        className={"mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4"}
      >
        <div
          className={
            "light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-light-200"
          }
        >
          <div className={" paragraph-semibold text-dark200_light900 "}>
            <p>{formatBigNumber(totalQuestions)}</p>
            <p className={"body-medium text-dark400_light700"}>Questions</p>
          </div>
          <div className={"paragraph-semibold text-dark200_light900 "}>
            <p>{formatBigNumber(totalAnswers)}</p>
            <p className={"body-medium text-dark400_light700"}>Answers</p>
          </div>
        </div>
        <StatsCard imgUrl={GoldMedal} value={0} title={"Gold Badges"} />
        <StatsCard imgUrl={SilverMedal} value={0} title={"Silver Badges"} />
        <StatsCard imgUrl={BronzeMedal} value={0} title={"Bronze Badges"} />
      </div>
    </div>
  );
}
