import { Link, Head } from "@inertiajs/react";
import ParticipantLayout from "@/Layouts/ParticipanLayout";

export default function NewQuiz({ auth, quizes = [] }) {
    const quizCount = quizes.length;
    const featuredQuiz = quizes[0];

    return (
        <ParticipantLayout auth={auth}>
            <Head title="New Quizzes" />

            <div className="min-h-screen py-8 sm:py-10">
                <div className="mx-auto max-w-7xl px-6 lg:px-0">
                    <section className="mb-8 overflow-hidden rounded-[32px] border border-cyan-100 bg-white shadow-lg shadow-slate-200/70">
                        <div className="grid gap-0 lg:grid-cols-[1.35fr_0.8fr]">
                            <div className="relative overflow-hidden bg-gradient-to-br from-cyan-100 via-emerald-50 to-white p-8 sm:p-10">
                                <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/70 blur-3xl" />
                                <div className="pointer-events-none absolute bottom-0 left-10 h-28 w-28 rounded-full bg-cyan-200/50 blur-2xl" />
                                <div className="relative">
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">
                                        New quizzes
                                    </p>
                                    <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-slate-950 sm:text-5xl">
                                        Latest challenges
                                    </h1>
                                    <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                                        Explore the newest quizzes, choose a
                                        topic that catches your eye, and start a
                                        quick learning session.
                                    </p>
                                    <div className="mt-7 flex flex-wrap gap-3">
                                        <Link
                                            href={route("home")}
                                            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-100"
                                        >
                                            Back to home
                                        </Link>
                                        <Link
                                            href={route(
                                                "participant.by_category_quiz",
                                            )}
                                            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                                        >
                                            Browse topics
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="grid content-center gap-4 border-t border-cyan-100 p-8 sm:p-10 lg:border-l lg:border-t-0">
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                                        Available now
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
                                <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5">
                                    <p className="text-sm font-semibold text-cyan-800">
                                        {featuredQuiz
                                            ? `Newest: ${featuredQuiz.title}`
                                            : "New quizzes will appear here when available."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">
                                Quiz list
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                                Pick a quiz to start
                            </h2>
                        </div>
                        <p className="text-sm text-slate-500">
                            {quizCount} {quizCount === 1 ? "quiz" : "quizzes"}{" "}
                            available
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {quizCount > 0 ? (
                            quizes.map((quiz, index) => (
                                <Link
                                    key={quiz.id ?? index}
                                    href={route(
                                        "participant.take_quiz",
                                        quiz.id,
                                    )}
                                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-cyan-200"
                                >
                                    <div
                                        className={
                                            "relative h-52 overflow-hidden bg-cover bg-center transition duration-500 group-hover:scale-105 " +
                                            (!quiz.thumbnail
                                                ? "bg-gradient-to-br from-cyan-100 via-emerald-100 to-amber-100"
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
                                        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                                            <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-cyan-700 shadow-sm">
                                                {quiz.category?.name ??
                                                    "General"}
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
                                            <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
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

                                        <div className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition group-hover:bg-cyan-700">
                                            Take quiz
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full rounded-3xl border border-dashed border-cyan-300 bg-white p-10 text-center shadow-sm">
                                <p className="text-lg font-semibold text-slate-900">
                                    No quizzes available yet
                                </p>
                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                    New quizzes will show up here once they are
                                    published. You can browse topics while
                                    waiting.
                                </p>
                                <Link
                                    href={route("participant.by_category_quiz")}
                                    className="mt-6 inline-flex items-center justify-center rounded-full bg-cyan-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800"
                                >
                                    Browse topics
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ParticipantLayout>
    );
}
