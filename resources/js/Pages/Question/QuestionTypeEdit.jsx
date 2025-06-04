import QuestionMultipleChoiceEdit from "./QuestionMultipleChoiceEdit";
import QuestionMultipleResponseEdit from "./QuestionMultipleResponseEdit";
import QuestionShortAnswerEdit from "./QuestionShortAnswerEdit";

export default function QuestionTypeEdit({
    type = "",
    typeId = 0,
    className = "",
    categories = [],
    categoryId = "",
    data = { content: "", answers: [] },
}) {
    console.log(data);
    if (type == "multiple_choice") {
        return (
            <QuestionMultipleChoiceEdit
                typeId={typeId}
                data={data}
                categories={categories}
                categoryId={categoryId}
            />
        );
    } else if (type == "multiple_response") {
        return (
            <QuestionMultipleResponseEdit
                typeId={typeId}
                data={data}
                categories={categories}
                categoryId={categoryId}
            />
        );
    } else if (type == "short_answer") {
        return (
            <QuestionShortAnswerEdit
                typeId={typeId}
                data={data}
                categories={categories}
                categoryId={categoryId}
            />
        );
    }
}
