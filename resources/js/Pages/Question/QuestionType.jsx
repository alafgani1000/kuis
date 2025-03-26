import QuestionMultipleChoice from "./QuestionMultipleChoice";
import QuestionMultipleResponse from "./QuestionMultipleResponse";
import QuestionShortAnswer from "./QuestionShortAnswer";

export default function QuestionType({
    type = "",
    typeId = 0,
    className = "",
}) {
    if (type == "multiple_choice") {
        return <QuestionMultipleChoice typeId={typeId} />;
    } else if (type == "multiple_response") {
        return <QuestionMultipleResponse />;
    } else if (type == "short_answer") {
        return <QuestionShortAnswer />;
    }
}
