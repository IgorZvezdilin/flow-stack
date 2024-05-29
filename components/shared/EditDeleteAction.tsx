"use client";

import Image from "next/image";
import Edit from "@/public/assets/icons/edit.svg";
import Delete from "@/public/assets/icons/trash.svg";
import { deleteQuestion } from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";
import { deleteAnswer } from "@/lib/actions/answer.action";

interface IEditDeleteAction {
  type: string;
  itemId: string;
}
export default function EditDeleteAction({ type, itemId }: IEditDeleteAction) {
  const pathName = usePathname();
  const router = useRouter();
  const handleEdit = () => {
    router.push(`/question/edit/${JSON.parse(itemId)}`);
  };
  const handleDelete = async () => {
    if (type === "Question") {
      await deleteQuestion({ questionId: JSON.parse(itemId), path: pathName });
    }
    if (type === "Answer") {
      await deleteAnswer({ answerId: JSON.parse(itemId), path: pathName });
    }
  };

  return (
    <div className={"flex items-center justify-end gap-3 max-sm:w-full"}>
      {type === "Question" && (
        <Image
          src={Edit}
          alt={"edit icon"}
          width={14}
          height={14}
          className={"cursor-pointer object-contain"}
          onClick={handleEdit}
        />
      )}
      <Image
        src={Delete}
        alt={"Delete icon"}
        width={14}
        height={14}
        className={"cursor-pointer object-contain"}
        onClick={handleDelete}
      />
    </div>
  );
}
