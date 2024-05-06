import Question from "@/components/shared/forms/Question";

function AskQuestion() {
  return (
    <div className={" h1-bold text-dark100_light900 "}>
      Ask a Question
      <div className={"mt-9"}>
        <Question />
      </div>
    </div>
  );
}

export default AskQuestion;
