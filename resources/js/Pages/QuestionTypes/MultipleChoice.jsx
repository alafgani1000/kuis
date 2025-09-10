export default function MultipleChoice({ question, onAnswering }) {
    const handleAnswer = (question, answerId) => {
        onAnswering(question, answerId);
    };

    return (
        <div key={question.id}>
            <div className="text-xl font-semibold">{question.question}</div>
            <ul className="list-none mt-8 ms-2 text-base space-y-2">
                {question.answers.map((answer, ianswer) => {
                    return (
                        <li
                            key={answer.id}
                            className="border flex items-center px-2 py-3 rounded-md hover:bg-slate-100"
                        >
                            <input
                                onClick={() =>
                                    handleAnswer(question, answer.id)
                                }
                                type="radio"
                                className="text-teal-500 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500 dark:focus:ring-gray-100 dark:ring-offset-gray-300 focus:ring-2 dark:bg-gray-300 dark:border-gray-300"
                                name={question.id}
                                id={answer.id}
                            />
                            <label
                                htmlFor={answer.id}
                                className="w-full ms-2 text-sm font-medium text-gray-900"
                            >
                                {answer.content}
                            </label>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
