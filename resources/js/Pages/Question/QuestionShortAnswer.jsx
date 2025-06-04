import { useState } from "react";
import Swal from "sweetalert2";

export default function QuestionShortAnswer({
    className = "",
    typeId = 0,
    categories = [],
}) {
    const [question, setQuestion] = useState({
        category: "",
        content: "",
        answer: "",
    });

    const resetData = () => {
        setQuestion({
            category: "",
            content: "",
            answer: "",
        });
    };

    const storeQuestion = () => {
        axios
            .post("/question", {
                question: question,
                type: typeId,
            })
            .then((res) => {
                Swal.fire({
                    title: "Message",
                    text: res.data,
                    icon: "success",
                });
                resetData();
            })
            .catch((err) => {
                Swal.fire({
                    title: "Error",
                    text: err.message,
                    icon: "error",
                });
            });
    };

    return (
        <div className={className}>
            <div className="bg-white rounded pt-2 pb-4 px-3">
                <label>Category</label>
                <select
                    className="rounded block mt-1 w-full border-gray-200 ring-gray-200"
                    value={question.category}
                    onChange={(e) => {
                        setQuestion((prev) => ({
                            ...prev,
                            category: e.target.value,
                        }));
                    }}
                >
                    <option value="">--- Please select category ---</option>
                    {categories.map((item) => {
                        return (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className="bg-white rounded pt-2 pb-4 px-3">
                <label>Question</label>
                <textarea
                    className="rounded block mt-1 w-full border-gray-200 ring-gray-200"
                    onChange={(e) => {
                        setQuestion((prev) => ({
                            ...prev,
                            content: e.target.value,
                        }));
                    }}
                    value={question.content}
                ></textarea>
            </div>
            <div className="bg-white rounded pt-2 pb-4 px-3 mt-4">
                <label>Answer</label>
                <input
                    className="rounded block mt-1 w-full border-gray-200 ring-gray-200"
                    onChange={(e) => {
                        setQuestion((prev) => ({
                            ...prev,
                            answer: e.target.value,
                        }));
                    }}
                    value={question.answer}
                />
            </div>

            <div className="flex justify-end pt-8">
                <button
                    onClick={() => storeQuestion()}
                    className="bg-sky-950 py-2 px-3 text-white rounded text-sm"
                >
                    <i className="bi bi-save"> </i>
                    Save
                </button>
            </div>
        </div>
    );
}
