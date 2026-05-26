import { Link, Head } from "@inertiajs/react";
import ParticipantLayout from "@/Layouts/ParticipanLayout";

export default function CategoryQuiz({ auth, category }) {
    const quizzes = category?.quizzes ?? [];
    const quizCount = quizzes.length;

    return (
        <ParticipantLayout auth={auth}>
            <Head title={`Category: ${category?.name ?? "Quiz"}`} />

            <div className="min-h-screen py-8 sm:py-10">
                <div className="mx-auto max-w-7xl px-6 lg:px-0">
                    <section className="mb-8 overflow-hidden rounded-[32px] border border-orange-100 bg-white shadow-lg shadow-slate-200/70">
                        <div className="grid gap-0 lg:grid-cols-[1.45fr_0.75fr]">
                            <div className="relative overflow-hidden bg-gradient-to-br from-orange-100 via-amber-50 to-cyan-50 p-8 sm:p-10">
                                <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/70 blur-3xl" />
                                <div className="pointer-events-none absolute bottom-0 left-10 h-28 w-28 rounded-full bg-orange-200/60 blur-2xl" />
                                <div className="relative">
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-700">
                                        Quiz category
                                    </p>
                                    <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-slate-950 sm:text-5xl">
                                        {category?.name}
                                    </h1>
                                    <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                                        {category?.description ??
                                            `Choose a quiz in the ${category?.name} category and start practicing at your own pace.`}
                                    </p>
                                    <div className="mt-7 flex flex-wrap gap-3">
                                        <Link
                                            href={route(
                                                "participant.by_category_quiz",
                                            )}
                                            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white"
                                        >
                                            Back to categories
                                        </Link>
                                        <Link
                                            href={route("home")}
                                            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                                        >
                                            Home
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="grid content-center gap-4 border-t border-orange-100 p-8 sm:p-10 lg:border-l lg:border-t-0">
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                                        Available quizzes
                                    </p>
                                    <p className="mt-3 text-4xl font-semibold text-slate-950">
                                        {quizCount}
                                    </p>
                                    <p className="mt-2 text-sm text-slate-500">
                                        {quizCount === 1
                                            ? "One quiz is ready to play."
                                            : "Quizzes are ready to play."}
                                    </p>
                                </div>
                                <div className="rounded-3xl border border-orange-200 bg-orange-50 p-5">
                                    <p className="text-sm font-semibold text-orange-800">
                                        {quizCount > 0
                                            ? "Pick any quiz below to begin."
                                            : "New quizzes can be added to this category later."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
                                Quiz list
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                                Start a challenge
                            </h2>
                        </div>
                        <p className="text-sm text-slate-500">
                            {quizCount} {quizCount === 1 ? "quiz" : "quizzes"}{" "}
                            in this category
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {quizCount > 0 ? (
                            quizzes.map((quiz, index) => (
                                <Link
                                    key={quiz.id ?? index}
                                    href={route(
                                        "participant.take_quiz",
                                        quiz.id,
                                    )}
                                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-200"
                                >
                                    <div
                                        className={
                                            "relative h-52 overflow-hidden bg-cover bg-center transition duration-500 group-hover:scale-105 " +
                                            (!quiz.thumbnail
                                                ? "bg-gradient-to-br from-orange-100 via-amber-100 to-cyan-100"
                                                : "")
                                        }
                                        style={
                                            quiz.thumbnail
                                                ? {
                                                      backgroundImage: `url(/storage/${quiz.thumbnail})`,
                                                  }
                                                : undefined
                                        }
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-orange-700 shadow-sm">
                                                {category?.name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-xl font-semibold text-slate-900">
                                            {quiz.title}
                                        </h3>
                                        <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-slate-500 line-clamp-3">
                                            {quiz.description ??
                                                "This quiz is ready to play. Test your knowledge and see how far you can go."}
                                        </p>

                                        <div className="mt-5 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                                                {quiz.questions_count ?? 0}{" "}
                                                questions
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                {quiz.time_limit ??
                                                    quiz.duration ??
                                                    "-"}{" "}
                                                min
                                            </span>
                                        </div>

                                        <div className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition group-hover:bg-orange-600">
                                            Start quiz
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full rounded-3xl border border-dashed border-orange-300 bg-white p-10 text-center shadow-sm">
                                <p className="text-lg font-semibold text-slate-900">
                                    No quizzes yet
                                </p>
                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                    This category does not have any quizzes
                                    available right now. Try another topic from
                                    the category list.
                                </p>
                                <Link
                                    href={route("participant.by_category_quiz")}
                                    className="mt-6 inline-flex items-center justify-center rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
                                >
                                    Browse categories
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ParticipantLayout>
    );
}
