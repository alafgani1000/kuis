import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import Category from "../Category/Category";

export default function QuestionMultipleResponseEdit({
    className = "",
    typeId = 0,
    data = {},
    categories = [],
    categoryId = "",
}) {
    const [counter, setCounter] = useState(data?.answers.length);
    const [question, setQuestion] = useState({
        category: categoryId,
        content: data.question,
        answers: data.answers,
    });
    const [id, setId] = useState(data.id);

    const createAnswer = () => {
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

    const changeAnswer = (id, content) => {
        let answers = question.answers;
        answers.map((item) => {
            if (item.id == id) {
                item.content = content;
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
            content: "",
            category: "",
            answers: [],
        });
        setCounter(0);
    };

    const storeQuestion = () => {
        axios
            .put(`/admin/question/${id}/update`, {
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
                    onChange={(e) => {
                        setQuestion((prev) => ({
                            ...prev,
                            category: e.target.value,
                        }));
                    }}
                    value={question.category}
                >
                    <option value="">Select Category</option>
                    {categories.map((item) => {
                        return (
                            <option value={item.id} key={item.id}>
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
                    onClick={createAnswer}
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
                            <div key={index} className="mt-2 flex">
                                <label className="me-2">
                                    <input
                                        onChange={() => pickTrueValue(item.id)}
                                        type="checkbox"
                                        className="border-gray-300 ring-gray-300"
                                        checked={item.correct}
                                    />
                                </label>
                                <input
                                    value={item.content}
                                    onChange={(e) => {
                                        changeAnswer(item.id, e.target.value);
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
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}
