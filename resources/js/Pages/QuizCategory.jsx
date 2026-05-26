import { Link, Head } from "@inertiajs/react";
import ParticipantLayout from "@/Layouts/ParticipanLayout";

export default function QuizCategory({ auth, categories = [] }) {
    return (
        <ParticipantLayout auth={auth}>
            <Head title="Quiz Categories" />
            <div className="min-h-screen bg-slate-50 py-10">
                <div className="mx-auto max-w-7xl px-6 lg:px-0">
                    <div className="mb-8 rounded-[32px] bg-white p-8 shadow-lg shadow-slate-200">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">
                                    Quiz categories
                                </p>
                                <h1 className="mt-3 text-4xl font-semibold text-slate-900">
                                    Choose a topic to explore
                                </h1>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                                    Browse quizzes sorted by category so you can
                                    focus on the subjects you love.
                                </p>
                            </div>
                            <Link
                                href={route("home")}
                                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                            >
                                Back to home
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {categories.length > 0 ? (
                            categories.map((category, index) => (
                                <Link
                                    key={category.id ?? index}
                                    href={route(
                                        "participant.category_quiz",
                                        category.id,
                                    )}
                                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-100 via-sky-100 to-indigo-100 text-2xl font-semibold text-sky-700 shadow-sm shadow-sky-200 transition group-hover:scale-105">
                                                {category.name
                                                    ?.slice(0, 2)
                                                    .toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-slate-900">
                                                    {category.name}
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    {category.quizzes_count}{" "}
                                                    quizzes
                                                </p>
                                            </div>
                                        </div>
                                        <p className="mt-5 text-sm leading-6 text-slate-600">
                                            Tap to browse all quizzes in this
                                            topic.
                                        </p>
                                        <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                                            <span className="inline-flex h-9 items-center rounded-full bg-slate-100 px-3">
                                                Open category
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500 shadow-sm">
                                No categories available yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ParticipantLayout>
    );
}
