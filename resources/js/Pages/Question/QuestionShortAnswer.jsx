import { useState } from "react";

export default function QuestionShortAnswer({ className = "" }) {
    const [question, setQuestion] = useState({
        content: "",
        answer: "",
    });

    const deleteAnswer = () => {
        let answer;
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
            <div className="bg-white rounded pt-2 pb-4 px-3 mt-4">
                <label>Answer</label>
                <input
                    className="rounded block mt-1 w-full border-gray-200 ring-gray-200"
                    onChange={(e) => {
                        question.answer = e.target.value;
                    }}
                    value={question.answer}
                />
            </div>

            <div className="flex justify-end pt-8">
                <button className="bg-sky-950 py-2 px-3 text-white rounded text-sm">
                    <i class="bi bi-save"> </i>
                    Save
                </button>
            </div>
        </div>
    );
}
