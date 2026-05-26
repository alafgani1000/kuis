import React, { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import parse from "html-react-parser";
import Modal from "@/Components/Modal";
import axios from "axios";
import QuizQuestionAnswer from "./QuizQuestionAnswer";
import Swal from "sweetalert2";
import { getCategories, getTypes } from "@/Components/js/helper";

export default function QuizQuestion({
    auth,
    questions,
    pgSearch,
    pgSort,
    pgPerPage,
    quiz,
}) {
    const [search, setSearch] = useState(pgSearch || "");
    const [sort, setSort] = useState(pgSort || "question");
    const [perPage, setPerPage] = useState(pgPerPage || 10);
    const [modalCreate, setModalCreate] = useState(false);
    const [masterQuestions, setMasterQuestions] = useState([]);
    const [types, setTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filter, setFilter] = useState({
        category: "",
        type: "",
        search: "",
    });
    const [questionPick, setQuestionPick] = useState("");
    const [questionAnswers, setQuestionAnswers] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [questionsData, setQuestionsData] = useState([]);
    const [tabStatusActive, setTabStatusActive] = useState("create");
    const [updatePick, setUpdatePick] = useState(null);

    const questionRows = questions?.data ?? [];
    const totalQuestions = questions?.total ?? questionRows.length;

    const refreshPage = () => {
        router.get(
            route(route().current(), { quiz_id: quiz.id }),
            { search, sort, perPage },
            {
                replace: true,
                preserveState: true,
            },
        );
    };

    const getMasterQuestions = async () => {
        try {
            const response = await axios.get(
                route("question.datas", { quiz: quiz.id }),
            );
            setMasterQuestions(response.data);
        } catch (error) {
            console.error("Error fetching master questions:", error);
        }
    };

    const getQuestions = async () => {
        try {
            const response = await axios.get(
                route("quiz.question.data", { quiz_id: quiz.id }),
            );
            setQuestionsData(response.data);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    const dataTypes = async () => {
        const { data } = await getTypes();
        setTypes(data);
    };

    const dataQuestionCategories = async () => {
        const { data } = await getCategories();
        setCategories(data);
    };

    useEffect(() => {
        dataQuestionCategories();
        getMasterQuestions();
        dataTypes();
        getQuestions();
    }, [processing]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            refreshPage();
        }, 350);

        return () => clearTimeout(timeout);
    }, [search, sort, perPage]);

    const selectedMasterQuestion = useMemo(() => {
        return masterQuestions.find((question) => question.id === questionPick);
    }, [masterQuestions, questionPick]);

    const filteredMasterQuestions = useMemo(() => {
        return masterQuestions.filter((question) => {
            const matchesType =
                filter.type === "" ||
                filter.type === "All" ||
                question.type_id == filter.type;
            const matchesCategory =
                filter.category === "" ||
                filter.category === "All" ||
                question.category_id == filter.category;
            const matchesSearch = question.question
                ?.toLowerCase()
                .includes(filter.search.toLowerCase());

            return matchesType && matchesCategory && matchesSearch;
        });
    }, [masterQuestions, filter]);

    const closeModalCreate = () => {
        setModalCreate(false);
        resetForm();
    };

    const resetForm = () => {
        setQuestionPick("");
        setQuestionAnswers([]);
        setUpdatePick(null);
    };

    const setActiveTab = (tab) => {
        setTabStatusActive(tab);
        resetForm();
    };

    const addAnswer = (id, event) => {
        const point = event.target.value;

        setQuestionAnswers((answers) => {
            const existingAnswer = answers.find((answer) => answer.id === id);

            if (existingAnswer) {
                return answers.map((answer) =>
                    answer.id === id ? { ...answer, point } : answer,
                );
            }

            return [...answers, { id, point }];
        });
    };

    const updateAnswer = (id, event) => {
        const score = event.target.value;

        setUpdatePick((current) => ({
            ...current,
            answers: current.answers.map((answer) =>
                answer.id === id ? { ...answer, score } : answer,
            ),
        }));
    };

    const quizQuestionStore = () => {
        if (!questionPick) {
            Swal.fire({
                icon: "warning",
                title: "Select a question",
                text: "Please choose a master question before saving.",
            });
            return;
        }

        const correctAnswers =
            selectedMasterQuestion?.answers?.filter(
                (answer) => answer.correct == 1,
            ) ?? [];
        const hasPointForCorrectAnswer = correctAnswers.every((answer) =>
            questionAnswers.some(
                (item) => item.id === answer.id && item.point !== "",
            ),
        );

        if (!hasPointForCorrectAnswer) {
            Swal.fire({
                icon: "warning",
                title: "Point is required",
                text: "Fill the point for every correct answer.",
            });
            return;
        }

        setProcessing(true);
        axios
            .put(route("quiz.question.store", quiz.id), {
                question: questionPick,
                answers: questionAnswers,
            })
            .then(() => {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Question added successfully.",
                });
                closeModalCreate();
                refreshPage();
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to add question.",
                });
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    const openUpdateModal = (question) => {
        setModalCreate(true);
        setTabStatusActive("update");
        setUpdatePick(question);
        setQuestionPick("");
        setQuestionAnswers([]);
    };

    const updateQuizQuestion = () => {
        if (!updatePick) {
            Swal.fire({
                icon: "warning",
                title: "Select a question",
                text: "Choose an existing quiz question to update.",
            });
            return;
        }

        setProcessing(true);
        axios
            .put(route("quiz.question.update", quiz.id), {
                answers: updatePick.answers,
            })
            .then(() => {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Question points updated successfully.",
                });
                closeModalCreate();
                refreshPage();
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to update question points.",
                });
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    const getTotalScore = (answers = []) => {
        return answers.reduce(
            (sum, item) => sum + (parseFloat(item.score) || 0),
            0,
        );
    };

    const totalPoints = questionsData.reduce(
        (sum, question) => sum + getTotalScore(question.answers),
        0,
    );

    const paginationHref = (url) => {
        if (!url) {
            return null;
        }

        return `${url}&search=${search}&sort=${sort}&perPage=${perPage}`;
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {quiz.title} - Questions
                </h2>
            }
        >
            <Head title={quiz.title + " - question"} />

            <div className="py-6 lg:py-10">
                <div className="mx-auto max-w-full space-y-6">
                    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 bg-white px-6 py-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                                        Quiz question manager
                                    </p>
                                    <h1 className="mt-2 text-2xl font-semibold text-slate-950">
                                        {quiz.title}
                                    </h1>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Manage questions and answer points for
                                        this quiz.
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setModalCreate(true);
                                        setTabStatusActive("create");
                                        resetForm();
                                    }}
                                    className="inline-flex items-center justify-center rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                                >
                                    <i className="bi bi-plus-square mr-2"></i>
                                    Manage Questions
                                </button>
                            </div>
                        </div>

                        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                            <div className="grid gap-3 lg:grid-cols-[150px_180px_1fr_auto_auto]">
                                <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3">
                                    <i className="bi bi-book-half text-slate-400"></i>
                                    <select
                                        value={perPage}
                                        onChange={(event) =>
                                            setPerPage(event.target.value)
                                        }
                                        className="w-full border-none bg-white py-2 text-sm text-slate-600 focus:ring-0"
                                    >
                                        <option value="10">10 rows</option>
                                        <option value="20">20 rows</option>
                                        <option value="50">50 rows</option>
                                        <option value="100">100 rows</option>
                                    </select>
                                </label>
                                <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3">
                                    <i className="bi bi-sort-down-alt text-slate-400"></i>
                                    <select
                                        value={sort}
                                        onChange={(event) =>
                                            setSort(event.target.value)
                                        }
                                        className="w-full border-none bg-white py-2 text-sm text-slate-600 focus:ring-0"
                                    >
                                        <option value="question">
                                            Sort by question
                                        </option>
                                    </select>
                                </label>
                                <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3">
                                    <i className="bi bi-search text-slate-400"></i>
                                    <input
                                        value={search}
                                        type="search"
                                        className="w-full border-none bg-white py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:ring-0"
                                        placeholder="Search question..."
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                    />
                                </label>
                                <div className="flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200">
                                    {totalQuestions} questions
                                </div>
                                <div className="flex items-center rounded-md bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
                                    {totalPoints} total points
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[980px] text-left text-sm">
                                <thead>
                                    <tr className="bg-white text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                        <th className="border-b border-slate-200 px-6 py-4">
                                            Question
                                        </th>
                                        <th className="border-b border-slate-200 px-6 py-4">
                                            Type
                                        </th>
                                        <th className="border-b border-slate-200 px-6 py-4">
                                            Category
                                        </th>
                                        <th className="border-b border-slate-200 px-6 py-4">
                                            Status
                                        </th>
                                        <th className="border-b border-slate-200 px-6 py-4 text-center">
                                            Point
                                        </th>
                                        <th className="border-b border-slate-200 px-6 py-4">
                                            Answers
                                        </th>
                                        <th className="border-b border-slate-200 px-6 py-4 text-right">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questionRows.length > 0 ? (
                                        questionRows.map((question, index) => (
                                            <tr
                                                className="transition hover:bg-slate-50"
                                                key={question.id ?? index}
                                            >
                                                <td className="border-b border-slate-100 px-6 py-4 align-top font-medium text-slate-900">
                                                    {question.question}
                                                </td>
                                                <td className="border-b border-slate-100 px-6 py-4 align-top text-slate-600">
                                                    {question.type?.name ?? "-"}
                                                </td>
                                                <td className="border-b border-slate-100 px-6 py-4 align-top text-slate-600">
                                                    {question.category?.name ??
                                                        "-"}
                                                </td>
                                                <td className="border-b border-slate-100 px-6 py-4 align-top">
                                                    {question.active === 1 ? (
                                                        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="border-b border-slate-100 px-6 py-4 text-center align-top font-semibold text-slate-900">
                                                    {getTotalScore(
                                                        question.answers,
                                                    )}
                                                </td>
                                                <td className="border-b border-slate-100 px-6 py-4 align-top">
                                                    <QuizQuestionAnswer
                                                        answers={
                                                            question.answers
                                                        }
                                                    />
                                                </td>
                                                <td className="border-b border-slate-100 px-6 py-4 text-right align-top">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openUpdateModal(
                                                                question,
                                                            )
                                                        }
                                                        className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                                                    >
                                                        Edit points
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-6 py-12 text-center"
                                            >
                                                <p className="text-lg font-semibold text-slate-900">
                                                    No questions found
                                                </p>
                                                <p className="mt-2 text-sm text-slate-500">
                                                    Add a question or adjust the
                                                    search filter.
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {questions?.links?.length > 0 && (
                            <div className="border-t border-slate-200 px-6 py-4">
                                <div className="hidden md:block">
                                    <ul className="flex flex-wrap items-center justify-center gap-1 text-sm">
                                        {questions.links.map((link, index) => (
                                            <li key={index}>
                                                <Link
                                                    href={paginationHref(
                                                        link.url,
                                                    )}
                                                    className={
                                                        "flex min-h-9 min-w-9 items-center justify-center rounded-md border px-3 py-2 " +
                                                        (link.active
                                                            ? "border-slate-900 bg-slate-900 text-white"
                                                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50")
                                                    }
                                                >
                                                    {parse(link.label)}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex items-center justify-between gap-3 md:hidden">
                                    <span className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-600">
                                        Page {questions.current_page} from{" "}
                                        {questions.last_page}
                                    </span>
                                    <div className="flex gap-2">
                                        <Link
                                            href={paginationHref(
                                                questions.prev_page_url,
                                            )}
                                            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                                        >
                                            Prev
                                        </Link>
                                        <Link
                                            href={paginationHref(
                                                questions.next_page_url,
                                            )}
                                            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                                        >
                                            Next
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            <Modal
                show={modalCreate}
                onClose={closeModalCreate}
                vcenter="items-start"
                padding="p-4 sm:p-6"
            >
                <div className="mx-auto max-w-7xl overflow-hidden rounded-xl bg-white shadow-2xl">
                    <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                                Manage quiz questions
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                                Add or update question points
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={closeModalCreate}
                            className="inline-flex h-10 w-10 items-center justify-center self-end rounded-md border border-slate-200 text-slate-600 transition hover:bg-rose-50 hover:text-rose-600 lg:self-auto"
                            aria-label="Close modal"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
                        <aside className="border-b border-slate-200 bg-slate-50 p-5 lg:border-b-0 lg:border-r">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        Existing quiz questions
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Select one to edit its points.
                                    </p>
                                </div>
                                <div className="flex flex-wrap justify-end gap-2">
                                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-600 ring-1 ring-slate-200">
                                        {questionsData.length} questions
                                    </span>
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
                                        {totalPoints} points
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 max-h-[560px] space-y-2 overflow-y-auto pr-1">
                                {questionsData.length > 0 ? (
                                    questionsData.map((question, index) => (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setActiveTab("update");
                                                setUpdatePick(question);
                                            }}
                                            key={question.id ?? index}
                                            className={
                                                "w-full rounded-lg border p-4 text-left transition " +
                                                (updatePick?.id === question.id
                                                    ? "border-emerald-300 bg-white shadow-sm"
                                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50")
                                            }
                                        >
                                            <p className="font-semibold text-slate-900">
                                                {question.question}
                                            </p>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                    {question.type?.name ?? "-"}
                                                </span>
                                                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                    {getTotalScore(
                                                        question.answers,
                                                    )}{" "}
                                                    points
                                                </span>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                                        No quiz questions added yet.
                                    </div>
                                )}
                            </div>
                        </aside>

                        <div className="p-5 sm:p-6">
                            <div className="mb-6 inline-flex rounded-lg bg-slate-100 p-1">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("create")}
                                    className={
                                        "rounded-md px-4 py-2 text-sm font-semibold transition " +
                                        (tabStatusActive === "create"
                                            ? "bg-white text-slate-950 shadow-sm"
                                            : "text-slate-600 hover:text-slate-950")
                                    }
                                >
                                    Add question
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("update")}
                                    className={
                                        "rounded-md px-4 py-2 text-sm font-semibold transition " +
                                        (tabStatusActive === "update"
                                            ? "bg-white text-slate-950 shadow-sm"
                                            : "text-slate-600 hover:text-slate-950")
                                    }
                                >
                                    Update points
                                </button>
                            </div>

                            {tabStatusActive === "create" ? (
                                <div>
                                    <div className="grid gap-3 md:grid-cols-3">
                                        <label>
                                            <span className="mb-2 block text-sm font-semibold text-slate-700">
                                                Type
                                            </span>
                                            <select
                                                value={filter.type}
                                                onChange={(event) =>
                                                    setFilter({
                                                        ...filter,
                                                        type: event.target
                                                            .value,
                                                    })
                                                }
                                                className="w-full rounded-lg border-slate-200 text-sm focus:border-emerald-500 focus:ring-emerald-100"
                                            >
                                                <option value="">Select type</option>
                                                <option value="All">All</option>
                                                {types.map((type, index) => (
                                                    <option
                                                        key={type.id ?? index}
                                                        value={type.id}
                                                    >
                                                        {type.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <label>
                                            <span className="mb-2 block text-sm font-semibold text-slate-700">
                                                Category
                                            </span>
                                            <select
                                                value={filter.category}
                                                onChange={(event) =>
                                                    setFilter({
                                                        ...filter,
                                                        category:
                                                            event.target.value,
                                                    })
                                                }
                                                className="w-full rounded-lg border-slate-200 text-sm focus:border-emerald-500 focus:ring-emerald-100"
                                            >
                                                <option value="">
                                                    Select category
                                                </option>
                                                <option value="All">All</option>
                                                {categories.map(
                                                    (category, index) => (
                                                        <option
                                                            key={
                                                                category.id ??
                                                                index
                                                            }
                                                            value={category.id}
                                                        >
                                                            {category.name}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </label>
                                        <label>
                                            <span className="mb-2 block text-sm font-semibold text-slate-700">
                                                Search
                                            </span>
                                            <input
                                                onChange={(event) =>
                                                    setFilter({
                                                        ...filter,
                                                        search: event.target
                                                            .value,
                                                    })
                                                }
                                                type="search"
                                                value={filter.search}
                                                placeholder="Search question..."
                                                className="w-full rounded-lg border-slate-200 text-sm focus:border-emerald-500 focus:ring-emerald-100"
                                            />
                                        </label>
                                    </div>

                                    <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.85fr]">
                                        <div className="max-h-[520px] overflow-y-auto rounded-lg border border-slate-200">
                                            {filteredMasterQuestions.length >
                                            0 ? (
                                                <div className="divide-y divide-slate-100">
                                                    {filteredMasterQuestions.map(
                                                        (question, index) => (
                                                            <label
                                                                key={
                                                                    question.id ??
                                                                    index
                                                                }
                                                                className={
                                                                    "flex cursor-pointer gap-3 p-4 transition hover:bg-slate-50 " +
                                                                    (questionPick ===
                                                                    question.id
                                                                        ? "bg-emerald-50"
                                                                        : "")
                                                                }
                                                            >
                                                                <input
                                                                    onChange={() => {
                                                                        setQuestionPick(
                                                                            question.id,
                                                                        );
                                                                        setQuestionAnswers(
                                                                            [],
                                                                        );
                                                                    }}
                                                                    checked={
                                                                        questionPick ===
                                                                        question.id
                                                                    }
                                                                    type="radio"
                                                                    name="pick_question"
                                                                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                                                                />
                                                                <span>
                                                                    <span className="block font-semibold text-slate-900">
                                                                        {
                                                                            question.question
                                                                        }
                                                                    </span>
                                                                    <span className="mt-2 flex flex-wrap gap-2">
                                                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                                            {question
                                                                                .category
                                                                                ?.name ??
                                                                                "-"}
                                                                        </span>
                                                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                                            {question
                                                                                .type
                                                                                ?.name ??
                                                                                "-"}
                                                                        </span>
                                                                    </span>
                                                                </span>
                                                            </label>
                                                        ),
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="p-8 text-center text-sm text-slate-500">
                                                    No master questions match
                                                    the current filters.
                                                </div>
                                            )}
                                        </div>

                                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                                            <h3 className="font-semibold text-slate-900">
                                                Answer points
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Fill points for correct answers
                                                before saving.
                                            </p>

                                            {selectedMasterQuestion ? (
                                                selectedMasterQuestion.answers
                                                    ?.length > 0 ? (
                                                    <div className="mt-4 space-y-3">
                                                        {selectedMasterQuestion.answers.map(
                                                            (
                                                                answer,
                                                                index,
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        answer.id ??
                                                                        index
                                                                    }
                                                                    className="rounded-lg border border-slate-200 bg-white p-4"
                                                                >
                                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                                        <p className="text-sm text-slate-700">
                                                                            {
                                                                                answer.content
                                                                            }
                                                                        </p>
                                                                        {answer.correct ==
                                                                        1 ? (
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                                                    Correct
                                                                                </span>
                                                                                <input
                                                                                    onChange={(
                                                                                        event,
                                                                                    ) =>
                                                                                        addAnswer(
                                                                                            answer.id,
                                                                                            event,
                                                                                        )
                                                                                    }
                                                                                    type="number"
                                                                                    min="0"
                                                                                    className="w-24 rounded-md border-slate-200 px-2 py-1 text-sm focus:border-emerald-500 focus:ring-emerald-100"
                                                                                    placeholder="Point"
                                                                                />
                                                                            </div>
                                                                        ) : (
                                                                            <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                                                                                Wrong
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                        <div className="flex justify-end pt-2">
                                                            <button
                                                                onClick={
                                                                    quizQuestionStore
                                                                }
                                                                type="button"
                                                                disabled={
                                                                    processing
                                                                }
                                                                className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                            >
                                                                {processing
                                                                    ? "Saving..."
                                                                    : "Save question"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                                                        This question has no
                                                        answers.
                                                    </div>
                                                )
                                            ) : (
                                                <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                                                    Select a master question to
                                                    set answer points.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {updatePick ? (
                                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                                            <h3 className="font-semibold text-slate-900">
                                                {updatePick.question}
                                            </h3>
                                            <div className="mt-4 space-y-3">
                                                {updatePick.answers?.map(
                                                    (answer, index) => (
                                                        <div
                                                            key={
                                                                answer.id ??
                                                                index
                                                            }
                                                            className="rounded-lg border border-slate-200 bg-white p-4"
                                                        >
                                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                                <p className="text-sm text-slate-700">
                                                                    {
                                                                        answer.content
                                                                    }
                                                                </p>
                                                                {answer.correct ==
                                                                1 ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                                            Correct
                                                                        </span>
                                                                        <input
                                                                            onChange={(
                                                                                event,
                                                                            ) =>
                                                                                updateAnswer(
                                                                                    answer.id,
                                                                                    event,
                                                                                )
                                                                            }
                                                                            type="number"
                                                                            min="0"
                                                                            className="w-24 rounded-md border-slate-200 px-2 py-1 text-sm focus:border-emerald-500 focus:ring-emerald-100"
                                                                            placeholder="Point"
                                                                            value={
                                                                                answer.score ??
                                                                                ""
                                                                            }
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                                                                        Wrong
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                            <div className="mt-5 flex justify-end">
                                                <button
                                                    onClick={
                                                        updateQuizQuestion
                                                    }
                                                    type="button"
                                                    disabled={processing}
                                                    className="inline-flex items-center justify-center rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {processing
                                                        ? "Updating..."
                                                        : "Update points"}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                                            <p className="font-semibold text-slate-900">
                                                Choose a question to update
                                            </p>
                                            <p className="mt-2 text-sm text-slate-500">
                                                Select an existing quiz question
                                                from the left panel first.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
