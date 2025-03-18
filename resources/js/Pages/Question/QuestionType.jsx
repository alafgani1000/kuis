import QuestionMultipleChoice from "./QuestionMultipleChoice";
import QuestionMultipleResponse from "./QuestionMultipleResponse";

export default function QuestionType({ type = "", className = "" }) {
    if (type == "multiple_choice") {
        return <QuestionMultipleChoice />;
    } else if (type == "multiple_response") {
        return <QuestionMultipleResponse />;
    }
}
