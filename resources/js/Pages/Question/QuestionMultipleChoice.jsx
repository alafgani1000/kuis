import { useState } from "react";

export default function QuestionMultipleChoice({ className = "" }) {
    const [question, setQuestion] = useState({
        content: "",
        answers: [],
    });
    const [counter, setCounter] = useState(0);

    const createAnwer = () => {
        let answers = question.answers;
        answers.push({
            id: counter,
            content: "",
            correct: false,
        });
        let count = counter + 1;
        setCounter(count);
        question.answers = answers;
    };

    return (
        <div className={className}>
            <div>
                <label>Question</label>
                <textarea
                    className="rounded block mt-1 w-full border-gray-400 ring-gray-400"
                    onChange={(e) => {
                        question.content = e.target.value;
                    }}
                    value={question.question}
                ></textarea>
            </div>
            <div className="mt-4 flex space-x-2">
                <button
                    onClick={createAnwer}
                    type="button"
                    className="bg-gray-300 px-3 rounded"
                >
                    +
                </button>
                <span>{counter}</span>
            </div>
            <div className="mt-6">
                <h3>List answer</h3>
                <ul>
                    {question.answers.map((item, index) => {
                        return (
                            <li key={item.id} className="mt-2">
                                <label className="me-2">
                                    <input type="radio" name="" />
                                </label>
                                <input type="text" className="rounded" />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
