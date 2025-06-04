import QuestionMultipleChoice from "./QuestionMultipleChoice";
import QuestionMultipleResponse from "./QuestionMultipleResponse";
import QuestionShortAnswer from "./QuestionShortAnswer";

export default function QuestionType({
    type = "",
    typeId = 0,
    categories = [],
    className = "",
}) {
    if (type == "multiple_choice") {
        return (
            <QuestionMultipleChoice typeId={typeId} categories={categories} />
        );
    } else if (type == "multiple_response") {
        return (
            <QuestionMultipleResponse typeId={typeId} categories={categories} />
        );
    } else if (type == "short_answer") {
        return <QuestionShortAnswer typeId={typeId} categories={categories} />;
    }
}
