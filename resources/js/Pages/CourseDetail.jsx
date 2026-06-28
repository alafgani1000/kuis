import { Head, Link, router } from "@inertiajs/react";
import ParticipantLayout from "@/Layouts/ParticipanLayout";

export default function CourseDetail({ auth, course, isEnrolled = false }) {
    const enroll = () => {
        router.post(route("participant.course.enroll", course.id));
    };

    return (
        <ParticipantLayout auth={auth}>
            <Head title={course.title} />

            <div className="min-h-screen py-8 sm:py-10">
                <div className="mx-auto max-w-7xl px-6 lg:px-0">
                    <section className="mb-8 overflow-hidden rounded-[32px] border border-emerald-100 bg-white shadow-lg shadow-slate-200/70">
                        <div className="grid lg:grid-cols-[1.35fr_0.8fr]">
                            <div className="bg-gradient-to-br from-emerald-100 via-cyan-50 to-white p-8 sm:p-10">
                                <Link
                                    href={route("participant.courses")}
                                    className="text-sm font-semibold text-emerald-700"
                                >
                                    Back to courses
                                </Link>
                                <div className="mt-6 flex items-center gap-3">
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                                        {course.category?.name ?? "Course detail"}
                                    </p>
                                    {course.rating > 0 && (
                                        <div className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                            <i className="bi bi-star-fill"></i>
                                            {course.rating}
                                        </div>
                                    )}
                                </div>
                                <h1 className="mt-4 text-4xl font-semibold text-slate-950 sm:text-5xl">
                                    {course.title}
                                </h1>
                                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                                    {course.description}
                                </p>
                                <div className="mt-7 flex flex-wrap gap-3">
                                    {isEnrolled ? (
                                        <Link
                                            href={route(
                                                "participant.course.learn",
                                                course.id,
                                            )}
                                            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                        >
                                            Continue learning
                                        </Link>
                                    ) : auth.user ? (
                                        <button
                                            onClick={enroll}
                                            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                        >
                                            Enroll course
                                        </button>
                                    ) : (
                                        <Link
                                            href={route("login")}
                                            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                        >
                                            Login to enroll
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className="grid content-center gap-4 border-t border-emerald-100 p-8 sm:p-10 lg:border-l lg:border-t-0">
                                <div className="rounded-3xl bg-slate-50 p-5">
                                    <p className="text-3xl font-semibold text-slate-950">
                                        {course.lessons_count}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Lessons
                                    </p>
                                </div>
                                <div className="rounded-3xl bg-cyan-50 p-5">
                                    <p className="text-3xl font-semibold text-slate-950">
                                        {course.quizzes_count}
                                    </p>
                                    <p className="mt-1 text-sm text-cyan-700">
                                        Quizzes
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
                        <section>
                            <h2 className="text-2xl font-semibold text-slate-900">
                                Lessons
                            </h2>
                            <div className="mt-4 space-y-4">
                                {course.lessons.map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                                    >
                                        <h3 className="font-semibold text-slate-900">
                                            {lesson.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-500">
                                            {lesson.description}
                                        </p>
                                        <p className="mt-4 text-sm font-semibold text-slate-700">
                                            {lesson.sublessons.length} topics
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-slate-900">
                                Course quizzes
                            </h2>
                            <div className="mt-4 space-y-4">
                                {course.quizzes.map((quiz) => (
                                    <div
                                        key={quiz.id}
                                        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                                    >
                                        <h3 className="font-semibold text-slate-900">
                                            {quiz.title}
                                        </h3>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                                                {quiz.questions_count} questions
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                {quiz.time_limit} min
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </ParticipantLayout>
    );
}
