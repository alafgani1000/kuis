import { useState } from "react";

export default function QuestionMultipleResponse({ className = "" }) {
    const [question, setQuestion] = useState({
        question: "",
        answer: [],
    });

    return (
        <div className={className}>
            <div>
                <lable>Question</lable>
                <textarea
                    className="rounded block mt-1 w-full border-gray-400 ring-gray-400"
                    onChange={(e) => setQuestion(e.target.value)}
                    value={question.question}
                ></textarea>
            </div>
        </div>
    );
}
