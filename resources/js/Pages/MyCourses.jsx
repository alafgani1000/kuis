import { Head, Link } from "@inertiajs/react";
import ParticipantLayout from "@/Layouts/ParticipanLayout";

export default function MyCourses({ auth, enrollments = [] }) {
    return (
        <ParticipantLayout auth={auth}>
            <Head title="My Courses" />

            <div className="min-h-screen py-8 sm:py-10">
                <div className="mx-auto max-w-7xl px-6 lg:px-0">
                    <div className="mb-8 rounded-[32px] border border-emerald-100 bg-gradient-to-br from-emerald-100 via-cyan-50 to-white p-8 shadow-lg shadow-slate-200/70">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                            My courses
                        </p>
                        <h1 className="mt-3 text-4xl font-semibold text-slate-950">
                            Continue learning
                        </h1>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {enrollments.length > 0 ? (
                            enrollments.map((enrollment) => (
                                <Link
                                    key={enrollment.id}
                                    href={route(
                                        "participant.course.learn",
                                        enrollment.course.id,
                                    )}
                                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <h3 className="text-xl font-semibold text-slate-900">
                                        {enrollment.course.title}
                                    </h3>
                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                                        {enrollment.course.description}
                                    </p>
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                            {
                                                enrollment.course.lessons
                                                    .length
                                            }{" "}
                                            lessons
                                        </span>
                                        <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                                            {
                                                enrollment.course.quizzes
                                                    .length
                                            }{" "}
                                            quizzes
                                        </span>
                                    </div>
                                    <div className="mt-6 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                                        Continue
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                                <p className="text-lg font-semibold text-slate-900">
                                    You have not enrolled in a course yet
                                </p>
                                <Link
                                    href={route("participant.courses")}
                                    className="mt-6 inline-flex rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
                                >
                                    Browse courses
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ParticipantLayout>
    );
}
