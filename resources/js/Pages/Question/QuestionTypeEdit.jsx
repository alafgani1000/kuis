import QuestionMultipleChoiceEdit from "./QuestionMultipleChoiceEdit";
import QuestionMultipleResponse from "./QuestionMultipleResponse";
import QuestionShortAnswer from "./QuestionShortAnswer";

export default function QuestionTypeEdit({
    type = "",
    typeId = 0,
    className = "",
    data = { content: "", answers: [] },
}) {
    if (type == "multiple_choice") {
        return <QuestionMultipleChoiceEdit typeId={typeId} data={data} />;
    } else if (type == "multiple_response") {
        return <QuestionMultipleResponse />;
    } else if (type == "short_answer") {
        return <QuestionShortAnswer />;
    }
}
