import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import parse from "html-react-parser";
import Modal from "@/Components/Modal";
import axios from "axios";
import { getQuizCategories } from "@/Components/js/helper";

export default function Quiz({ auth, quizzes, pgSearch, pgSort, pgPerPage }) {
    const [search, setSearch] = useState(pgSearch || "");
    const [sort, setSort] = useState(pgSort || "");
    const [perPage, setPerPage] = useState(pgPerPage || 10);
    const [wasSearch, setWasSearch] = useState(false);
    const [modalCreate, setModalCreate] = useState(false);
    const [modalConfirmDelete, setModalConfirmDelete] = useState(false);
    const [modalConfirmPublish, setModalConfirmPublish] = useState(false);
    const [modalConfirmUnpublish, setModalConfirmUnpublish] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [id, setId] = useState("");
    const [idDelete, setIdDelete] = useState("");
    const [idPublish, setIdPublish] = useState("");
    const [idUnpublish, setIdUnpublish] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [formTitle, setFormTitle] = useState("Create New Quiz");
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");

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

    const handleEdit = (data) => {
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category?.id);
        setId(data.id);
        setIsEdit(true);
        setModalCreate(true);
        setFormTitle("Update Quiz");
    };

    const dataCategories = async () => {
        const { data } = await getQuizCategories();
        setCategories(data);
    };

    useEffect(() => {
        handleSearch();
        dataCategories();
    }, [search, sort, perPage]);

    const closeModal = () => {
        setModalCreate(false);
        setTitle("");
        setDescription("");
        setCategory("");
        setId("");
        setIsEdit(false);
        setFormTitle("Create New Quiz");
    };

    const closeModalDelete = () => {
        setModalConfirmDelete(false);
        setIdDelete("");
    };

    const showModalCreate = () => {
        setModalCreate(true);
    };

    const confirmDeleteQuiz = (data) => {
        setModalConfirmDelete(true);
        setIdDelete(data.id);
    };

    const confirmPublishQuiz = (data) => {
        setModalConfirmPublish(true);
        setIdPublish(data.id);
    };

    const closeModalPublish = () => {
        setModalConfirmPublish(false);
        setIdPublish("");
    };

    const confirmUnpublishQuiz = (data) => {
        setModalConfirmUnpublish(true);
        setIdUnpublish(data.id);
    };

    const closeModalUnpublish = () => {
        setModalConfirmUnpublish(false);
        setIdUnpublish("");
    };

    const deleteQuiz = (e) => {
        e.preventDefault();
        axios
            .delete(`/admin/quiz/${idDelete}/delete`)
            .then((res) => {
                closeModalDelete();
                handleRefresh();
            })
            .catch((res) => {
                console.log(res.data);
            });
    };

    const publishQuiz = (e) => {
        e.preventDefault();
        axios
            .put(`/admin/quiz/${idPublish}/publish`)
            .then((res) => {
                closeModalPublish();
                handleRefresh();
            })
            .catch((res) => {
                console.log(res.data);
            });
    };

    const unpublishQuiz = (e) => {
        e.preventDefault();
        axios
            .put(`/admin/quiz/${idUnpublish}/unpublish`)
            .then((res) => {
                closeModalUnpublish();
                handleRefresh();
            })
            .catch((res) => {
                console.log(res.data);
            });
    };

    const saveQuiz = (e) => {
        e.preventDefault();
        if (isEdit === false) {
            axios
                .post("/admin/quiz", {
                    title: title,
                    description: description,
                    category: category,
                })
                .then((res) => {
                    handleRefresh();
                    closeModal();
                })
                .catch((error) => {
                    console.log(error.response.data);
                });
        } else if (isEdit === true) {
            axios
                .put(`/admin/quiz/${id}/update`, {
                    title: title,
                    description: description,
                    category: category,
                })
                .then((res) => {
                    handleRefresh();
                    closeModal();
                })
                .catch((error) => {
                    console.log(error.response.data);
                });
        }
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Quiz
                </h2>
            }
        >
            <Head title="Quiz" />

            <div className="py-4 lg:py-12 md:py-12">
                <div className="max-w-full mx-auto space-y-6">
                    <div className="bg-white rounded-md shadow">
                        <div className="text-gray-900 relative overflow-x-auto">
                            <div className="bg-white py-3 px-6 mt-0 mb-4 text-gray-800 font-bold border-b border-zinc rounded-t-md text-lg">
                                Data Quiz
                            </div>
                            <div className="flex justify-end mr-8">
                                <button
                                    onClick={showModalCreate}
                                    className="border-sky-950 py-2 px-3 bg-sky-950 hover:text-white hover:bg-sky-900 hover:border-sky-900 rounded text-white text-sm"
                                >
                                    <span className="text-sm mr-2">
                                        <i className="bi bi-plus-square"></i>
                                    </span>
                                    New Quiz
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
                                                <option value="title">
                                                    Title
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
                                                Title
                                            </th>
                                            <th className="text-left py-4 px-4">
                                                Description
                                            </th>
                                            <th className="text-left py-4 px-4">
                                                Category
                                            </th>
                                            <th className="text-left py-4 px-4">
                                                Published
                                            </th>
                                            <th className="text-center py-4 px-4">
                                                Question
                                            </th>
                                            <th className="text-left py-4 px-4">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quizzes.data.map((quiz, index) => {
                                            return (
                                                <tr
                                                    className="border-t last:border-b"
                                                    key={index}
                                                >
                                                    <td className="text-left py-3 px-4">
                                                        {quiz.title}
                                                    </td>
                                                    <td className="text-left py-3 px-4">
                                                        {quiz.description}
                                                    </td>
                                                    <td className="text-left py-3 px-4">
                                                        {quiz.category?.name}
                                                    </td>
                                                    <td className="text-left py-3 px-4">
                                                        {quiz.published ===
                                                        1 ? (
                                                            <span className="text-green-600 bg-green-300 px-2 py-1 rounded shadow text-sm font-medium">
                                                                Published
                                                            </span>
                                                        ) : (
                                                            <span className="text-red-600 bg-red-300 px-2 py-1 rounded shadow text-sm font-medium">
                                                                Unpublished
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="text-center py-3 px-4">
                                                        {quiz.questions_count}
                                                    </td>
                                                    <td className="content-center">
                                                        <div className="flex flex-wrap space-x-1">
                                                            {quiz.published ===
                                                            1 ? (
                                                                <button
                                                                    onClick={() => {
                                                                        confirmUnpublishQuiz(
                                                                            quiz
                                                                        );
                                                                    }}
                                                                    title="Click to Unpublish"
                                                                    className="bg-gray-600 px-2 py-1 text-white text-sm rounded"
                                                                >
                                                                    <i className="bi bi-cloud-download"></i>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => {
                                                                        confirmPublishQuiz(
                                                                            quiz
                                                                        );
                                                                    }}
                                                                    title="Click to Publish"
                                                                    className="bg-gray-200 px-2 py-1 text-gray-800 text-sm rounded"
                                                                >
                                                                    <i className="bi bi-cloud-upload"></i>
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => {
                                                                    handleEdit(
                                                                        quiz
                                                                    );
                                                                }}
                                                                title="Click to Edit"
                                                                className="bg-yellow-500 px-2 py-1 text-white text-sm rounded"
                                                            >
                                                                <i className="bi bi-pencil-square"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    confirmDeleteQuiz(
                                                                        quiz
                                                                    );
                                                                }}
                                                                title="Click to Delete"
                                                                className="bg-rose-600 px-2 py-1 text-white text-sm rounded"
                                                            >
                                                                <i className="bi bi-trash3-fill"></i>
                                                            </button>
                                                            <Link
                                                                className="bg-blue-400 px-2 py-1 text-white text-sm rounded"
                                                                title="Click to view detail Quiz"
                                                                href={route(
                                                                    "quiz.question.index",
                                                                    [quiz.id]
                                                                )}
                                                            >
                                                                <i className="bi bi-postcard"></i>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {/* pagination */}
                                <div className="hidden mt-4 mb-4 w-full md:block md:w-auto">
                                    <ul className="flex justify-center items-center -space-x-px text-base h-10">
                                        {quizzes.links.map((link, index) => {
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
                                                Page {quizzes.current_page}
                                                &nbsp; from {
                                                    quizzes.last_page
                                                }{" "}
                                            </span>{" "}
                                        </div>
                                        <div className="flex justify-start space-x-4">
                                            <Link
                                                href={`${quizzes.prev_page_url}&search=${search}&perPage=${perPage}`}
                                                className="border py-2 px-4 rounded-md hover:bg-sky-500 hover:border-sky-500 hover:text-white"
                                            >
                                                Prev
                                            </Link>
                                            <Link
                                                href={`${quizzes.next_page_url}&search=${search}&perPage=${perPage}`}
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

            <Modal show={modalCreate}>
                <div className="bg-white rounded max-w-3xl w-full mx-auto">
                    <div className="flex flex-col items-end m-0 p-0">
                        <button
                            onClick={() => closeModal()}
                            className="bg-zinc-700 px-3 py-1 text-white hover:bg-rose-600 rounded-tr"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <form onSubmit={saveQuiz} className="px-6 pb-6">
                        <h2 className="text-lg font-medium text-gray-900">
                            {formTitle}
                        </h2>
                        <div className="grid mt-4">
                            <label className="mb-2">Title:</label>
                            <input
                                type="text"
                                className="rounded-lg focus:ring-sky-500 focus:border-sky-500"
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                }}
                                value={title}
                            />
                        </div>
                        <div className="grid mt-4">
                            <label className="mb-2">Category:</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="rounded-lg focus:ring-sky-500 focus:border-sky-500"
                            >
                                {categories?.map((dataCategory, index) => {
                                    return (
                                        <option
                                            key={index}
                                            value={dataCategory.id}
                                        >
                                            {dataCategory.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="grid mt-4">
                            <label className="mb-2">Description:</label>
                            <textarea
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                                className="rounded-lg focus:ring-sky-500 focus:border-sky-500"
                                value={description}
                            ></textarea>
                        </div>
                        <div className="grid justify-end mt-4">
                            <button
                                type="submit"
                                className="border border-sky-500 py-2 px-4 rounded-md text-sm bg-sky-500 text-white hover:bg-sky-600"
                            >
                                {isEdit === true ? "Update" : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* modal confirm delete */}
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
                    <form onSubmit={deleteQuiz} className="px-6 pb-6">
                        <div className="mt-4">
                            <h2 className="text-lg font-medium text-gray-900">
                                Are you sure you want to delete this quiz?
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

            {/* modal publish quiz */}
            <Modal show={modalConfirmPublish}>
                <div className="bg-white rounded max-w-lg mx-auto">
                    <div className="flex flex-col items-end m-0 p-0">
                        <button
                            onClick={() => closeModalPublish()}
                            className="bg-zinc-700 px-3 py-1 text-white hover:bg-black rounded-tr"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <form onSubmit={publishQuiz} className="px-6 pb-6">
                        <div className="mt-4">
                            <h2 className="text-lg font-medium text-gray-900">
                                Are you sure you want to Publish this quiz?
                            </h2>
                            <div className="grid justify-end mt-4">
                                <button
                                    type="submit"
                                    className="border border-rose-500 py-2 px-4 rounded text-sm bg-rose-500 text-white hover:bg-rose-600"
                                >
                                    Publish
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* modal unpublish quiz */}
            <Modal show={modalConfirmUnpublish}>
                <div className="bg-white rounded max-w-lg mx-auto">
                    <div className="flex flex-col items-end m-0 p-0">
                        <button
                            onClick={() => closeModalUnpublish()}
                            className="bg-zinc-700 px-3 py-1 text-white hover:bg-black rounded-tr"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <form onSubmit={unpublishQuiz} className="px-6 pb-6">
                        <div className="mt-4">
                            <h2 className="text-lg font-medium text-gray-900">
                                Are you sure you want to Unpublish this quiz?
                            </h2>
                            <div className="grid justify-end mt-4">
                                <button
                                    type="submit"
                                    className="border border-rose-500 py-2 px-4 rounded text-sm bg-rose-500 text-white hover:bg-rose-600"
                                >
                                    Unpublish
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
