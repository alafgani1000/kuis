import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Modal from "@/Components/Modal";
import axios from "axios";

export default function Course({ auth, courses, categories, pgSearch, pgSort, pgPerPage }) {
    const [search, setSearch] = useState(pgSearch || "");
    const [sort, setSort] = useState(pgSort || "id");
    const [perPage, setPerPage] = useState(pgPerPage || 10);
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [form, setForm] = useState({ title: "", description: "", category_id: "", rating: 0 });
    const [processing, setProcessing] = useState(false);

    const refresh = () => {
        router.get(
            route("course.index"),
            { search, sort, perPage },
            { replace: true, preserveState: true },
        );
    };

    useEffect(() => {
        const timeout = setTimeout(() => refresh(), 300);
        return () => clearTimeout(timeout);
    }, [search, sort, perPage]);

    const openCreate = () => {
        setEditingCourse(null);
        setForm({ title: "", description: "", category_id: "", rating: 0 });
        setShowForm(true);
    };

    const openEdit = (course) => {
        setEditingCourse(course);
        setForm({
            title: course.title,
            description: course.description,
            category_id: course.category_id || "",
            rating: course.rating || 0,
        });
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingCourse(null);
        setForm({ title: "", description: "", category_id: "", rating: 0 });
    };

    const saveCourse = (event) => {
        event.preventDefault();
        setProcessing(true);

        const request = editingCourse
            ? axios.put(`/admin/course/${editingCourse.id}/update`, form)
            : axios.post("/admin/course", form);

        request
            .then(() => {
                closeForm();
                refresh();
            })
            .finally(() => setProcessing(false));
    };

    const deleteCourse = (course) => {
        if (!confirm(`Delete course "${course.title}"?`)) {
            return;
        }

        axios.delete(`/admin/course/${course.id}/delete`).then(() => refresh());
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="leading-tight">Courses</h2>}
        >
            <Head title="Courses" />

            <div className="py-6 lg:py-10">
                <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                                    Course manager
                                </p>
                                <h1 className="mt-2 text-2xl font-semibold text-slate-950">
                                    Learning courses
                                </h1>
                                <p className="mt-1 text-sm text-slate-500">
                                    Create courses, add lessons, and attach
                                    quizzes when needed.
                                </p>
                            </div>
                            <button
                                onClick={openCreate}
                                className="inline-flex items-center justify-center rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                                <i className="bi bi-plus-square mr-2"></i>
                                New Course
                            </button>
                        </div>
                    </div>

                    <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                        <div className="grid gap-3 lg:grid-cols-[150px_180px_1fr]">
                            <select
                                value={perPage}
                                onChange={(event) =>
                                    setPerPage(event.target.value)
                                }
                                className="rounded-md border-slate-200 text-sm"
                            >
                                <option value="10">10 rows</option>
                                <option value="20">20 rows</option>
                                <option value="50">50 rows</option>
                            </select>
                            <select
                                value={sort}
                                onChange={(event) => setSort(event.target.value)}
                                className="rounded-md border-slate-200 text-sm"
                            >
                                <option value="id">Newest</option>
                                <option value="title">Title</option>
                            </select>
                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                type="search"
                                placeholder="Search courses..."
                                className="rounded-md border-slate-200 text-sm"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead>
                                <tr className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                    <th className="border-b border-slate-200 px-6 py-4">
                                        Course
                                    </th>
                                    <th className="border-b border-slate-200 px-6 py-4">
                                        Teacher
                                    </th>
                                    <th className="border-b border-slate-200 px-6 py-4">
                                        Category
                                    </th>
                                    <th className="border-b border-slate-200 px-6 py-4 text-center">
                                        Rating
                                    </th>
                                    <th className="border-b border-slate-200 px-6 py-4 text-center">
                                        Lessons
                                    </th>
                                    <th className="border-b border-slate-200 px-6 py-4 text-center">
                                        Quizzes
                                    </th>
                                    <th className="border-b border-slate-200 px-6 py-4 text-center">
                                        Enrolled
                                    </th>
                                    <th className="border-b border-slate-200 px-6 py-4 text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.data.map((course) => (
                                    <tr
                                        key={course.id}
                                        className="transition hover:bg-slate-50"
                                    >
                                        <td className="border-b border-slate-100 px-6 py-4">
                                            <p className="font-semibold text-slate-900">
                                                {course.title}
                                            </p>
                                            <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                                                {course.description}
                                            </p>
                                        </td>
                                        <td className="border-b border-slate-100 px-6 py-4 text-slate-600">
                                            {course.teacher?.name ?? "-"}
                                        </td>
                                        <td className="border-b border-slate-100 px-6 py-4 text-slate-600">
                                            {course.category?.name ?? "-"}
                                        </td>
                                        <td className="border-b border-slate-100 px-6 py-4 text-center font-semibold text-amber-500">
                                            {course.rating > 0 ? (
                                                <div className="flex items-center justify-center gap-1">
                                                    <i className="bi bi-star-fill text-xs"></i>
                                                    {course.rating}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 font-normal">No rating</span>
                                            )}
                                        </td>
                                        <td className="border-b border-slate-100 px-6 py-4 text-center font-semibold">
                                            {course.lessons_count}
                                        </td>
                                        <td className="border-b border-slate-100 px-6 py-4 text-center font-semibold">
                                            {course.quizzes_count}
                                        </td>
                                        <td className="border-b border-slate-100 px-6 py-4 text-center font-semibold">
                                            {course.enrollments_count}
                                        </td>
                                        <td className="border-b border-slate-100 px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route(
                                                        "course.builder",
                                                        course.id,
                                                    )}
                                                    className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
                                                >
                                                    Builder
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        openEdit(course)
                                                    }
                                                    className="rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-white"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteCourse(course)
                                                    }
                                                    className="rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            <Modal show={showForm} onClose={closeForm}>
                <div className="mx-auto max-w-xl rounded-lg bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                        <h2 className="text-lg font-semibold text-slate-900">
                            {editingCourse ? "Update Course" : "Create Course"}
                        </h2>
                        <button
                            type="button"
                            onClick={closeForm}
                            className="rounded-md px-3 py-2 text-slate-500 hover:bg-slate-100"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <form onSubmit={saveCourse} className="space-y-4 p-6">
                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-slate-700">
                                Title
                            </span>
                            <input
                                value={form.title}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        title: event.target.value,
                                    })
                                }
                                className="w-full rounded-lg border-slate-200 text-sm"
                                required
                            />
                        </label>
                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold text-slate-700">
                                Description
                            </span>
                            <textarea
                                value={form.description}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        description: event.target.value,
                                    })
                                }
                                rows="5"
                                className="w-full rounded-lg border-slate-200 text-sm"
                                required
                            />
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-700">
                                    Category
                                </span>
                                <select
                                    value={form.category_id}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            category_id: event.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border-slate-200 text-sm"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-700">
                                    Rating (0 - 5)
                                </span>
                                <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={form.rating}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            rating: event.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border-slate-200 text-sm"
                                />
                            </label>
                        </div>
                        <div className="flex justify-end">
                            <button
                                disabled={processing}
                                className="rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                            >
                                {processing ? "Saving..." : "Save Course"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
