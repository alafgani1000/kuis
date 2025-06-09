export default function MultipleChoice({ question }) {
    return (
        <div key={question.id}>
            <div className="text-xl font-semibold">{question.question} ?</div>
            <ul className="list-none mt-8 ms-2 text-base space-y-2">
                {question.answers.map((answer, ianswer) => {
                    return (
                        <li
                            className="border px-4 py-2 rounded-lg"
                            key={answer.id}
                        >
                            {answer.content}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
