import { useState } from "react";
import Swal from "sweetalert2";

export default function QuestionMultipleResponse({
    className = "",
    typeId = 0,
    categories = [],
}) {
    const [question, setQuestion] = useState({
        category: "",
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

    const pickTrueValue = (id) => {
        let answers = question.answers;
        answers.map((item) => {
            if (item.id == id) {
                if (item.correct) {
                    item.correct = false;
                } else {
                    item.correct = true;
                }
            }
        });
        setQuestion((prev) => ({ ...prev, answers: answers }));
    };

    const deleteAnswer = (id) => {
        let answers = question.answers;
        answers = answers.filter((item, index) => {
            return item.id != id;
        });
        let count = answers.length;
        setCounter(count);
        question.answers = answers;
    };

    const resetData = () => {
        setQuestion({
            category: "",
            content: "",
            answers: [],
        });
        setCounter(0);
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
            <div className="mt-4 flex space-x-6 items-center">
                <button
                    onClick={createAnwer}
                    type="button"
                    className="bg-sky-950 px-2 py-2 rounded text-white"
                >
                    + Add answer
                </button>
                <span className="py-2 px-3 rounded bg-slate-300">
                    {counter}
                </span>
            </div>
            <div className="my-4">
                <h3 className="my-4">List answer</h3>
                <div>
                    {question.answers.map((item, index) => {
                        return (
                            <div key={item.id} className="mt-2 flex">
                                <label className="me-2">
                                    <input
                                        onChange={(e) => pickTrueValue(item.id)}
                                        checked={item.correct}
                                        type="checkbox"
                                        className="border-gray-300 ring-gray-300 rounded"
                                    />
                                </label>
                                <input
                                    onChange={(e) => {
                                        item.content = e.target.value;
                                    }}
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
                    <button
                        onClick={() => storeQuestion()}
                        className="bg-sky-950 py-2 px-3 text-white rounded text-sm"
                    >
                        <i className="bi bi-save"> </i>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
