import { Link, Head } from "@inertiajs/react";
import ParticipantLayout from "@/Layouts/ParticipanLayout";

export default function Welcome({ auth, quizes = [], categories = [] }) {
    const featuredQuiz = quizes[0];
    const hasFeaturedImage = Boolean(featuredQuiz?.thumbnail);

    return (
        <ParticipantLayout auth={auth}>
            <Head title="Welcome" />
            <div className="min-h-screen bg-white">
                <section className="relative overflow-hidden rounded-b-[36px] border-b border-slate-200 bg-white">
                    <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-br from-emerald-100 via-cyan-50 to-amber-100" />
                    <div className="relative mx-auto max-w-7xl px-6 py-10 sm:py-14 lg:px-0">
                        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                            <div>
                                <span className="inline-flex rounded-full border border-emerald-200 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 shadow-sm">
                                    Quiz App
                                </span>
                                <h1 className="mt-5 max-w-3xl text-4xl font-semibold text-slate-950 sm:text-5xl">
                                    Learn faster with quizzes that feel simple
                                    to start.
                                </h1>
                                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                                    Choose a new challenge, browse by topic, and
                                    keep practicing with a clean quiz experience
                                    made for quick learning sessions.
                                </p>

                                <div className="mt-7 flex flex-wrap gap-3">
                                    <Link
                                        href={route("participant.new_quiz")}
                                        className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                                    >
                                        Start a quiz
                                    </Link>
                                    <Link
                                        href={route(
                                            "participant.by_category_quiz",
                                        )}
                                        className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
                                    >
                                        Browse topics
                                    </Link>
                                </div>

                                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
                                            Latest quizzes
                                        </p>
                                        <p className="mt-3 text-3xl font-semibold text-slate-950">
                                            {quizes.length}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Fresh challenges ready to play.
                                        </p>
                                    </div>
                                    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                                            Categories
                                        </p>
                                        <p className="mt-3 text-3xl font-semibold text-slate-950">
                                            {categories.length}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-600">
                                            Topics for focused practice.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-[32px] border border-white bg-white shadow-2xl shadow-slate-900/10">
                                <div
                                    className={
                                        "relative h-72 bg-cover bg-center sm:h-80 " +
                                        (!hasFeaturedImage
                                            ? "bg-gradient-to-br from-emerald-100 via-cyan-100 to-amber-100"
                                            : "")
                                    }
                                    style={
                                        hasFeaturedImage
                                            ? {
                                                  backgroundImage: `url(/storage/${featuredQuiz.thumbnail})`,
                                              }
                                            : undefined
                                    }
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                                            Featured quiz
                                        </p>
                                        <h2 className="mt-2 text-2xl font-semibold text-white">
                                            {featuredQuiz?.title ??
                                                "Pick your first challenge"}
                                        </h2>
                                        <p className="mt-2 text-sm text-white/75">
                                            {featuredQuiz
                                                ? `${featuredQuiz.questions_count ?? 0} questions - ${featuredQuiz.time_limit ?? "-"} min`
                                                : "New quizzes will appear here when available."}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid gap-3 p-5 sm:grid-cols-2">
                                    <Link
                                        href={
                                            featuredQuiz
                                                ? route(
                                                      "participant.take_quiz",
                                                      featuredQuiz.id,
                                                  )
                                                : route("participant.new_quiz")
                                        }
                                        className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                    >
                                        Play featured
                                    </Link>
                                    <Link
                                        href={route("participant.new_quiz")}
                                        className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                                    >
                                        View all quizzes
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <main className="mx-auto max-w-7xl space-y-14 px-6 py-12 lg:px-0">
                    <section
                        id="quizzes"
                        className="border-t border-slate-200 pt-10"
                    >
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">
                                    New quiz
                                </p>
                                <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                                    Latest challenges
                                </h2>
                            </div>
                            <Link
                                href={route("participant.new_quiz")}
                                className="inline-flex w-fit items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                            >
                                See all
                            </Link>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {quizes.length > 0 ? (
                                quizes.slice(0, 6).map((quiz, index) => (
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
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                                            <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-cyan-700">
                                                {quiz.category?.name ??
                                                    "General"}
                                            </span>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-xl font-semibold text-slate-900">
                                                {quiz.title}
                                            </h3>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                    {quiz.questions_count ?? 0}{" "}
                                                    questions
                                                </span>
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                    {quiz.time_limit ?? "-"} min
                                                </span>
                                            </div>
                                            <div className="mt-6 inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition group-hover:bg-emerald-600">
                                                Take quiz
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                                    <p className="text-lg font-semibold text-slate-900">
                                        No quizzes available yet
                                    </p>
                                    <p className="mt-2 text-sm text-slate-500">
                                        New challenges will show up here.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section
                        id="categories"
                        className="border-t border-slate-200 pt-10"
                    >
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
                                    Quiz categories
                                </p>
                                <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                                    Browse by topic
                                </h2>
                            </div>
                            <Link
                                href={route("participant.by_category_quiz")}
                                className="inline-flex w-fit items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                            >
                                See categories
                            </Link>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                            {categories.length > 0 ? (
                                categories.slice(0, 8).map((category, index) => (
                                    <Link
                                        key={category.id ?? index}
                                        href={route(
                                            "participant.category_quiz",
                                            category.id,
                                        )}
                                        className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-200"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-xl font-semibold text-orange-700 transition group-hover:bg-orange-600 group-hover:text-white">
                                                {category.name
                                                    ?.slice(0, 2)
                                                    .toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="truncate text-lg font-semibold text-slate-900">
                                                    {category.name}
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    {category.quizzes_count ?? 0}{" "}
                                                    quizzes
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-5 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 transition group-hover:bg-orange-50 group-hover:text-orange-700">
                                            Explore
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                                    <p className="text-lg font-semibold text-slate-900">
                                        No categories available yet
                                    </p>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Topics will appear here once they are
                                        added.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </ParticipantLayout>
    );
}
