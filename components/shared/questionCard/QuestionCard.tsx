import Link from "next/link";
import RenderTag from "../renderTag/RenderTag";
import Metric from "../metric/Metric";
import Like from "@/public/assets/icons/like.svg";
import Answer from "@/public/assets/icons/message.svg";
import Eye from "@/public/assets/icons/eye.svg";
import Avatar from "@/public/assets/icons/avatar.svg";
import { formatBigNumber, getTimeStamp } from "@/lib/utils";

interface IQuestionCard {
  _id: number;
  title: string;
  tags: {
    _id: number;
    name: string;
  }[];
  author: {
    _id: number;
    name: string;
    picture: string;
  };
  upvotes: number;
  views: number;
  answers: number;
  createdAt: Date;
}

export default function QuestionCard({
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}: IQuestionCard) {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11 ">
      <div className=" flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className=" sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
      </div>
      <div className=" mt-3.5 flex w-full flex-wrap justify-start gap-2">
        {tags.map((tag) => (
          <RenderTag key={tag._id} name={tag.name} _id={tag._id} />
        ))}
      </div>
      <div className=" flex-between mt-6 w-full flex-wrap gap-3 max-md:flex-col max-md:items-start">
        <Metric
          imgUrl={author.picture || Avatar}
          alt="user"
          value={author.name}
          title={` - asked ${getTimeStamp(createdAt)}`}
          href={`/profile/${author._id}`}
          textStyles=" small-medium text-dark400_light700"
          isAuthor
        />
        <div className=" flex flex-row gap-3">
          <Metric
            imgUrl={Like}
            alt="upotes"
            value={formatBigNumber(upvotes)}
            title=" Votes"
            textStyles=" small-medium text-dark400_light800"
          />
          <Metric
            imgUrl={Answer}
            alt="asnwers"
            value={formatBigNumber(answers)}
            title=" Ansvers"
            textStyles=" small-medium text-dark400_light800"
          />
          <Metric
            imgUrl={Eye}
            alt="eye"
            value={formatBigNumber(views)}
            title=" Views"
            textStyles=" small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
}
