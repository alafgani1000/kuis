import { Head, Link, router } from "@inertiajs/react";
import ParticipantLayout from "@/Layouts/ParticipanLayout";
import { useState } from "react";

export default function CourseCatalog({ auth, courses = [], categories = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");
    const [categoryId, setCategoryId] = useState(filters.category_id || "");

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(
            route("participant.courses"),
            { search, category_id: categoryId },
            { preserveState: true, preserveScroll: true }
        );
    };
    return (
        <ParticipantLayout auth={auth}>
            <Head title="Courses" />

            <div className="min-h-screen py-8 sm:py-10">
                <div className="mx-auto max-w-7xl px-6 lg:px-0">
                    <section className="mb-8 rounded-[32px] border border-emerald-100 bg-gradient-to-br from-emerald-100 via-cyan-50 to-white p-8 shadow-lg shadow-slate-200/70 sm:p-10">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                            Courses
                        </p>
                        <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-slate-950 sm:text-5xl">
                            Learn with structured lessons and quizzes.
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                            Pick a course, study the lessons, then take the
                            attached quizzes when you are ready.
                        </p>
                    </section>

                    <form onSubmit={handleFilter} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="flex-1 rounded-full border-slate-200 px-6 py-3 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select
                            className="rounded-full border-slate-200 px-6 py-3 text-sm focus:border-emerald-500 focus:ring-emerald-500 sm:w-64"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                            Search
                        </button>
                    </form>

                    <div className="mb-5 flex items-end justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                                Course catalog
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                                Available courses
                            </h2>
                        </div>
                        <p className="text-sm text-slate-500">
                            {courses.length} courses
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <Link
                                    key={course.id}
                                    href={route(
                                        "participant.course.show",
                                        course.id,
                                    )}
                                    className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                                                    {course.category?.name ?? "Course"}
                                                </p>
                                                {course.rating > 0 && (
                                                    <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                                                        <i className="bi bi-star-fill"></i>
                                                        {course.rating}
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="mt-2 text-xl font-semibold text-slate-900">
                                                {course.title}
                                            </h3>
                                        </div>
                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 whitespace-nowrap">
                                            {course.lessons_count} lessons
                                        </span>
                                    </div>
                                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                                        {course.description}
                                    </p>
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                            {course.quizzes_count} quizzes
                                        </span>
                                        <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                                            {course.enrollments_count} enrolled
                                        </span>
                                    </div>
                                    <div className="mt-6 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-emerald-700">
                                        View course
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                                <p className="text-lg font-semibold text-slate-900">
                                    No courses available yet
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ParticipantLayout>
    );
}
