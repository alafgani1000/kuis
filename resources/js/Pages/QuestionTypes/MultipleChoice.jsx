export default function MultipleChoice({ question }) {
    return (
        <div key={question.id} className="text-xl">
            <div>{question.question} ?</div>
            <ul className="list-none mt-4 ms-8">
                {question.answers.map((answer, ianswer) => {
                    return (
                        <li key={answer.id}>
                            <input
                                type="radio"
                                className="me-2"
                                name={question.id}
                            />
                            {answer.content}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
