import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import parse from "html-react-parser";
import Modal from "@/Components/Modal";
import axios from "axios";
import QuestionType from "./QuestionType";
import QuestionTypeEdit from "./QuestionTypeEdit";

export default function Question({
    auth,
    questions,
    pgSearch,
    pgSort,
    pgPerPage,
}) {
    const [search, setSearch] = useState(pgSearch || "");
    const [sort, setSort] = useState(pgSort || "");
    const [perPage, setPerPage] = useState(pgPerPage || 10);
    const [wasSearch, setWasSearch] = useState(false);
    const [modalCreate, setModalCreate] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [modalConfirmDelete, setModalConfirmDelete] = useState(false);
    const [question, setQuestion] = useState({});
    const [active, setActive] = useState(false);
    const [score, setScore] = useState(0);
    const [id, setId] = useState("");
    const [idDelete, setIdDelete] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [formTitle, setFormTitle] = useState("Create Question");
    const [questionType, setQuestionType] = useState("");
    const [typeQuestions, setTypeQuestions] = useState([]);
    const [categories, setCategories] = useState([]);

    const handleSearch = () => {
        // handle search
        if (wasSearch) {
            router.get(
                route(route().current()),
                { search: search, sort: sort, perPage: perPage },
                {
                    replace: true,
                    preserveState: true,
                }
            );
        }
    };

    const handleRefresh = () => {
        // handle search
        router.get(
            route(route().current()),
            { search: search, sort: sort, perPage: perPage },
            {
                replace: true,
                preserveState: true,
            }
        );
    };

    const getTypeQuestion = () => {
        axios
            .get("/type/data")
            .then((res) => {
                setTypeQuestions(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getCategories = async () => {
        try {
            const response = await axios.get(route("category.data"));
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching master questions:", error);
        }
    };

    useEffect(() => {
        getTypeQuestion();
        getCategories();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [search, sort, perPage]);

    const closeModalDelete = () => {
        setModalConfirmDelete(false);
        setIdDelete("");
    };

    const confirmDeleteQuestion = (data) => {
        setModalConfirmDelete(true);
        setIdDelete(data.id);
    };

    const deleteQuestion = (e) => {
        e.preventDefault();
        axios
            .delete(`/question/${idDelete}/delete`)
            .then((res) => {
                closeModalDelete();
                handleRefresh();
            })
            .catch((res) => {
                console.log(res.data);
            });
    };

    const showFormCreate = () => {
        setQuestionType("");
        setModalCreate(true);
    };

    const closeModalCreate = () => {
        setModalCreate(false);
        handleRefresh();
    };

    const showModalEdit = (data) => {
        setQuestion(data);
        setQuestionType(data?.type);
        setModalEdit(true);
    };

    const closeModalEdit = () => {
        setModalEdit(false);
        handleRefresh();
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="leading-tight">Question</h2>}
        >
            <Head title="Question" />

            <div className="py-4 lg:py-12 md:py-12">
                <div className="max-w-full mx-auto space-y-6">
                    <div className="bg-white rounded-md shadow">
                        <div className="text-gray-900 relative overflow-x-auto">
                            <div className="bg-white py-3 px-6 mt-0 mb-4 text-gray-700 font-bold border-b border-zinc rounded-t-md text-lg">
                                Data Question
                            </div>
                            <div className="flex justify-end mr-8">
                                <button
                                    onClick={() => showFormCreate()}
                                    className="border-blue-950 py-2 px-2.5 bg-sky-950 hover:text-white hover:bg-sky-900 hover:border-sky-900 rounded text-white text-sm"
                                >
                                    <span className="text-sm mr-2">
                                        <i className="bi bi-plus-square"></i>
                                    </span>
                                    New Question
                                </button>
                            </div>
                            <div className="lg:mx-8 md:mx-8 mx-0 my-8 border border-zinc-100 md:rounded-lg lg:rounded-lg">
                                <div className="grid bg-zinc-100 py-4 px-4 border-b border-zinc-200 items-center">
                                    <div className="lg:flex lg:space-x-4 justify-start">
                                        <div className="flex items-center space-x-2 bg-white rounded-md ps-3 md:mb-2 mb-2">
                                            <span className="text-base text-slate-400">
                                                <i className="bi bi-book-half"></i>
                                            </span>
                                            <select
                                                value={perPage}
                                                onChange={(e) => {
                                                    setPerPage(e.target.value);
                                                    setWasSearch(true);
                                                }}
                                                className="py-2 bg-white border-none focus:outline-none focus:border-white focus:ring-white block rounded-md text-base focus:ring-0 text-gray-500 w-full"
                                            >
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-white rounded-md ps-3 md:mb-2 mb-2">
                                            <span className="text-base text-slate-500">
                                                <i className="bi bi-sort-down-alt"></i>
                                            </span>
                                            <select
                                                value={sort}
                                                onChange={(e) => {
                                                    setSort(e.target.value);
                                                    setWasSearch(true);
                                                }}
                                                className="py-2 bg-white border-none focus:outline-none focus:border-white focus:ring-white block rounded-md text-base focus:ring-0 text-gray-500 w-full"
                                            >
                                                <option value="name">
                                                    Question
                                                </option>
                                            </select>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-white rounded-md ps-3 md:mb-2 mb-2">
                                            <span className="text-sm text-slate-400">
                                                <i className="bi bi-search"></i>
                                            </span>
                                            <input
                                                value={search}
                                                type="text"
                                                className="bg-white shadow-sm border-none placeholder-slate-400 rounded-md focus:outline-none focus:ring-0 block sm:text-base text-gray-500 w-full"
                                                placeholder="Search"
                                                onChange={(e) => {
                                                    setSearch(e.target.value);
                                                    setWasSearch(true);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <table className="text-sm md:text-base w-full table-auto me-4">
                                    <thead className="bg-zinc-100 p-2">
                                        <tr className="p-8">
                                            <th className="text-left py-4 px-4">
                                                Question
                                            </th>
                                            <th className="text-left py-4 px-4">
                                                Type
                                            </th>
                                            <th className="text-left py-4 px-4">
                                                Category
                                            </th>
                                            <th className="text-left py-4 px-4">
                                                Answers
                                            </th>
                                            <th className="text-left py-4 px-4">
                                                Active
                                            </th>
                                            <th className="text-center py-4 px-4">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {questions.data.map(
                                            (question, index) => {
                                                return (
                                                    <tr
                                                        className="border-t last:border-b"
                                                        key={index}
                                                    >
                                                        <td className="text-left py-3 px-4">
                                                            {question.question}
                                                        </td>
                                                        <td className="text-left py-3 px-4">
                                                            {
                                                                question.type
                                                                    ?.name
                                                            }
                                                        </td>
                                                        <td className="text-left py-3 px-4">
                                                            {
                                                                question
                                                                    .category
                                                                    ?.name
                                                            }
                                                        </td>
                                                        <td className="text-left py-3 px-4">
                                                            <ul className="list-disc">
                                                                {question.answers.map(
                                                                    (
                                                                        answer,
                                                                        i
                                                                    ) => {
                                                                        return (
                                                                            <li
                                                                                key={
                                                                                    i
                                                                                }
                                                                            >
                                                                                {
                                                                                    answer.content
                                                                                }{" "}
                                                                                {answer.correct ==
                                                                                    1 && (
                                                                                    <i className="bi bi-check2-circle text-teal-600"></i>
                                                                                )}
                                                                            </li>
                                                                        );
                                                                    }
                                                                )}
                                                            </ul>
                                                        </td>
                                                        <td className="text-left py-3 px-4">
                                                            {question.active ==
                                                            1 ? (
                                                                <i className="bi bi-check2-circle text-teal-600"></i>
                                                            ) : (
                                                                <i className="bi bi-x-circle text-rose-600"></i>
                                                            )}
                                                        </td>
                                                        <td className="content-center">
                                                            <div className="flex flex-wrap items-center justify-center space-x-1">
                                                                <button
                                                                    onClick={() =>
                                                                        showModalEdit(
                                                                            question
                                                                        )
                                                                    }
                                                                    className="bg-yellow-500 px-2 py-1 text-white text-sm rounded"
                                                                >
                                                                    <i className="bi bi-pencil-square"></i>
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        confirmDeleteQuestion(
                                                                            question
                                                                        );
                                                                    }}
                                                                    className="bg-rose-600 px-2 py-1 text-white text-sm rounded"
                                                                >
                                                                    <i className="bi bi-trash3-fill"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                                {/* pagination */}
                                <div className="hidden mt-4 mb-4 w-full md:block md:w-auto">
                                    <ul className="flex justify-center items-center -space-x-px text-base h-10">
                                        {questions.links.map((link, index) => {
                                            return (
                                                <li
                                                    key={index}
                                                    className="first:rounded-l-md border last:rounded-e-md"
                                                >
                                                    {link.active === false ? (
                                                        link.url === null ? (
                                                            <Link
                                                                href={null}
                                                                className="flex items-center justify-center px-2 py-1 text-sm lg:text-base md:px-3 md:py-2"
                                                                disabled
                                                            >
                                                                {parse(
                                                                    link.label
                                                                )}
                                                            </Link>
                                                        ) : (
                                                            <Link
                                                                href={`${link.url}&search=${search}&perPage=${perPage}`}
                                                                className="flex items-center justify-center px-2 py-1 text-sm lg:text-base md:px-3 md:py-2"
                                                                disabled
                                                            >
                                                                {parse(
                                                                    link.label
                                                                )}
                                                            </Link>
                                                        )
                                                    ) : (
                                                        <Link
                                                            href={null}
                                                            className="flex items-center justify-center px-2 py-1 lg:text-base bg-slate-100 text-sm md:px-3 md:py-2"
                                                        >
                                                            {`${parse(
                                                                link.label
                                                            )}`}
                                                        </Link>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <div className="md:hidden lg:hidden">
                                    <div className="grid grid-cols-2 text-sm md:grid-cols-2 lg:grid-cols-2 md:text-base lg:text-base space-x-4 my-4 mx-8">
                                        <div className="flex justify-start text-zinc-600 ">
                                            <span className="py-2 px-2 bg-zinc-100 rounded">
                                                Page {questions.current_page}
                                                &nbsp; from{" "}
                                                {questions.last_page}{" "}
                                            </span>{" "}
                                        </div>
                                        <div className="flex justify-start space-x-4">
                                            <Link
                                                href={`${questions.prev_page_url}&search=${search}&perPage=${perPage}`}
                                                className="border py-2 px-4 rounded-md hover:bg-sky-500 hover:border-sky-500 hover:text-white"
                                            >
                                                Prev
                                            </Link>
                                            <Link
                                                href={`${questions.next_page_url}&search=${search}&perPage=${perPage}`}
                                                className="border py-2 px-4 rounded-md hover:bg-sky-500 hover:border-sky-500 hover:text-white"
                                            >
                                                Next
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={modalCreate} vcenter="items-start">
                <div className="bg-white rounded max-w-4xl mx-auto pb-4">
                    <div className="flex flex-col items-end m-0 p-0">
                        <button
                            onClick={() => closeModalCreate()}
                            className="bg-zinc-700 px-3 py-1 text-white hover:bg-black rounded-tr"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <h2 className="text-lg font-medium text-gray-900 mx-4">
                        Form Create Question
                    </h2>
                    <div className="px-4 pb-4 bg-gray-100 mt-4 py-4 rounded mx-4">
                        <div className="space-y-4">
                            <div className="max-w-full rounded pt-2 pb-4 px-3 bg-white">
                                <label>Type Question</label>
                                <select
                                    onChange={(e) => {
                                        let code = typeQuestions.find(
                                            (item) => {
                                                return (
                                                    item.id == e.target.value
                                                );
                                            }
                                        );
                                        setQuestionType(code);
                                    }}
                                    className="mt-1 block w-full rounded border-gray-200 ring-gray-200"
                                >
                                    <option value="">
                                        --- Please Choice ---
                                    </option>
                                    {typeQuestions.map((type, i) => {
                                        return (
                                            <option key={i} value={type.id}>
                                                {type.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="max-w-full">
                                <QuestionType
                                    type={questionType.code}
                                    typeId={questionType.id}
                                    categories={categories}
                                />
                            </div>
                            {/* <div className="grid justify-end mt-4"></div> */}
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal show={modalEdit} vcenter="items-start">
                <div className="bg-white rounded max-w-4xl mx-auto pb-4">
                    <div className="flex flex-col items-end m-0 p-0">
                        <button
                            onClick={() => closeModalEdit()}
                            className="bg-zinc-700 px-3 py-1 text-white hover:bg-black rounded-tr"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <h2 className="text-lg font-medium text-gray-900 mx-4">
                        Form Edit Question
                    </h2>
                    <div className="px-4 pb-4 bg-gray-100 mt-4 py-4 rounded mx-4">
                        <div className="space-y-4">
                            <div className="max-w-full rounded pt-2 pb-4 px-3 bg-white">
                                <label>Type Question</label>
                                <select
                                    value={question.type_id}
                                    onChange={(e) => {
                                        let code = typeQuestions.find(
                                            (item) => {
                                                return (
                                                    item.id == e.target.value
                                                );
                                            }
                                        );
                                        setQuestionType(code);
                                    }}
                                    className="mt-1 block w-full rounded border-gray-200 ring-gray-200"
                                >
                                    <option value="">
                                        --- Please Choice ---
                                    </option>
                                    {typeQuestions.map((type, i) => {
                                        return (
                                            <option key={i} value={type.id}>
                                                {type.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="max-w-full">
                                <QuestionTypeEdit
                                    type={questionType.code}
                                    typeId={questionType.id}
                                    data={question}
                                    categories={categories}
                                    categoryId={question.category_id}
                                />
                            </div>
                            {/* <div className="grid justify-end mt-4"></div> */}
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal show={modalConfirmDelete}>
                <div className="bg-white rounded max-w-lg mx-auto">
                    <div className="flex flex-col items-end m-0 p-0">
                        <button
                            onClick={() => closeModalDelete()}
                            className="bg-zinc-700 px-3 py-1 text-white hover:bg-black rounded-tr"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <form onSubmit={deleteQuestion} className="px-6 pb-6">
                        <div className="mt-4">
                            <h2 className="text-lg font-medium text-gray-900">
                                Are you sure you want to delete this question
                                data?
                            </h2>

                            <p className="mt-1 text-sm text-gray-600">
                                Data will be permanently deleted.
                            </p>
                            <div className="grid justify-end mt-4">
                                <button
                                    type="submit"
                                    className="border border-rose-500 py-2 px-4 rounded text-sm bg-rose-500 text-white hover:bg-rose-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
