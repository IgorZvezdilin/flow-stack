import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface IRenderTag {
  _id: number;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
}

export default function RenderTag({
  _id,
  name,
  totalQuestions,
  showCount,
}: IRenderTag) {
  return (
    <Link href={`/tags/${_id}`} className=" flex justify-between gap-2">
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 pb-2 pt-2.5 uppercase">
        {name}
      </Badge>
      {showCount && (
        <p className="small-mdeium text-dark500_light700">{totalQuestions}</p>
      )}
    </Link>
  );
}
