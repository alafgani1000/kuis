import { useState } from "react";

export default function QuestionMultipleResponse({ className = "" }) {
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

    const deleteAnswer = (id) => {
        let answers = question.answers;
        answers = answers.filter((item, index) => {
            return item.id != id;
        });
        console.log(answers);
        let count = answers.length;
        setCounter(count);
        question.answers = answers;
    };

    return (
        <div className={className}>
            <div className="bg-white rounded pt-2 pb-4 px-3">
                <label>Question</label>
                <textarea
                    className="rounded block mt-1 w-full border-gray-200 ring-gray-200"
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
                    className="bg-sky-950 px-3 rounded text-white"
                >
                    +
                </button>
                <span>{counter}</span>
            </div>
            <div className="my-4">
                <h3 className="my-4">List answer</h3>
                <div>
                    {question.answers.map((item, index) => {
                        return (
                            <div key={item.id} className="mt-2 flex">
                                <label className="me-2">
                                    <input
                                        type="checkbox"
                                        name=""
                                        className="border-gray-300 ring-gray-300 rounded"
                                    />
                                </label>
                                <input
                                    type="text"
                                    className="rounded-s h-8 w-full border-gray-300 ring-gray-300"
                                />
                                <button
                                    onClick={() => deleteAnswer(item.id)}
                                    type="button"
                                    className="bg-rose-500 px-2 py-1 rounded-e text-white hover:bg-rose-600"
                                >
                                    x
                                </button>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-end pt-8">
                    <button className="bg-sky-950 py-2 px-3 text-white rounded text-sm">
                        <i class="bi bi-save"> </i>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
