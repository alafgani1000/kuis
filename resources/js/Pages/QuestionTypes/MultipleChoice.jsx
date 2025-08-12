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
                            className="border flex items-center px-2 py-2 rounded-md hover:bg-slate-100"
                        >
                            <input
                                onClick={() =>
                                    handleAnswer(question, answer.id)
                                }
                                type="radio"
                                className="text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                name={question.id}
                                id={answer.id}
                            />
                            <label
                                htmlFor={answer.id}
                                className="w-full ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
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
