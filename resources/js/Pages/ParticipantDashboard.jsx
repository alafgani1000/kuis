import { useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import ParticipantLayout from "@/Layouts/ParticipanLayout";

export default function ParticipantDashboard({ auth, takes = [] }) {
    const [search, setSearch] = useState("");
    const [scoreFilter, setScoreFilter] = useState("all");

    const totalQuizzes = takes.length;
    const averageScore = totalQuizzes
        ? Math.round(
              takes.reduce((sum, take) => sum + (take.score || 0), 0) /
                  totalQuizzes,
          )
        : 0;
    const bestScore = totalQuizzes
        ? Math.max(...takes.map((take) => take.score || 0))
        : 0;
    const highScores = takes.filter((take) => (take.score ?? 0) >= 80).length;

    const filteredTakes = useMemo(() => {
        return takes.filter((take) => {
            const title = take.quiz?.title ?? "";
            const titleMatch = title
                .toLowerCase()
                .includes(search.trim().toLowerCase());
            const scoreValue = take.score ?? 0;
            const scoreMatch =
                scoreFilter === "all" ||
                (scoreFilter === "high" && scoreValue >= 80) ||
                (scoreFilter === "medium" &&
                    scoreValue >= 50 &&
                    scoreValue < 80) ||
                (scoreFilter === "low" && scoreValue < 50);

            return titleMatch && scoreMatch;
        });
    }, [takes, search, scoreFilter]);

    const scoreBadgeClass = (score) => {
        const value = score ?? 0;

        if (value >= 80) {
            return "bg-emerald-100 text-emerald-700";
        }

        if (value >= 50) {
            return "bg-amber-100 text-amber-700";
        }

        return "bg-rose-100 text-rose-700";
    };

    return (
        <ParticipantLayout auth={auth}>
            <Head title="Participant Dashboard" />

            <div className="min-h-screen py-8 sm:py-10">
                <div className="mx-auto max-w-7xl px-6 lg:px-0">
                    <section className="mb-8 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-lg shadow-slate-200/70">
                        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
                            <div className="bg-gradient-to-br from-emerald-100 via-cyan-50 to-white p-8 sm:p-10">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                                    Your progress
                                </p>
                                <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-slate-950 sm:text-5xl">
                                    Keep track of every quiz you finish.
                                </h1>
                                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                                    Review your scores, spot patterns, and jump
                                    back into practice whenever you are ready.
                                </p>
                                <div className="mt-7 flex flex-wrap gap-3">
                                    <Link
                                        href={route("participant.new_quiz")}
                                        className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                                    >
                                        Start new quiz
                                    </Link>
                                    <Link
                                        href={route("home")}
                                        className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
                                    >
                                        Back to home
                                    </Link>
                                </div>
                            </div>

                            <div className="grid gap-4 border-t border-slate-200 p-8 sm:grid-cols-2 sm:p-10 lg:border-l lg:border-t-0">
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                                        Completed
                                    </p>
                                    <p className="mt-3 text-3xl font-semibold text-slate-950">
                                        {totalQuizzes}
                                    </p>
                                </div>
                                <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
                                        Average
                                    </p>
                                    <p className="mt-3 text-3xl font-semibold text-slate-950">
                                        {averageScore}%
                                    </p>
                                </div>
                                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                                        Best score
                                    </p>
                                    <p className="mt-3 text-3xl font-semibold text-slate-950">
                                        {bestScore}%
                                    </p>
                                </div>
                                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                                        80%+
                                    </p>
                                    <p className="mt-3 text-3xl font-semibold text-slate-950">
                                        {highScores}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-lg shadow-slate-200/70">
                        <div className="border-b border-slate-200 bg-white p-6 sm:p-8">
                            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-700">
                                        Quiz history
                                    </p>
                                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                                        Completed attempts
                                    </h2>
                                </div>
                                <p className="text-sm text-slate-500">
                                    Showing {filteredTakes.length} of{" "}
                                    {totalQuizzes}
                                </p>
                            </div>

                            <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_220px_auto]">
                                <label className="block">
                                    <span className="sr-only">
                                        Search quiz title
                                    </span>
                                    <input
                                        type="search"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Search quiz title..."
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                                    />
                                </label>
                                <label className="block">
                                    <span className="sr-only">
                                        Filter score range
                                    </span>
                                    <select
                                        value={scoreFilter}
                                        onChange={(event) =>
                                            setScoreFilter(event.target.value)
                                        }
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                                    >
                                        <option value="all">All scores</option>
                                        <option value="high">
                                            High (80%+)
                                        </option>
                                        <option value="medium">
                                            Medium (50-79%)
                                        </option>
                                        <option value="low">
                                            Low (&lt;50%)
                                        </option>
                                    </select>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setScoreFilter("all");
                                    }}
                                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
                                >
                                    Clear filters
                                </button>
                            </div>
                        </div>

                        {takes.length > 0 ? (
                            filteredTakes.length > 0 ? (
                                <>
                                    <div className="hidden overflow-x-auto lg:block">
                                        <table className="min-w-full border-separate border-spacing-0 text-left">
                                            <thead>
                                                <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                                                    <th className="border-b border-slate-200 px-6 py-4">
                                                        Quiz
                                                    </th>
                                                    <th className="border-b border-slate-200 px-6 py-4 text-center">
                                                        Score
                                                    </th>
                                                    <th className="border-b border-slate-200 px-6 py-4">
                                                        Started
                                                    </th>
                                                    <th className="border-b border-slate-200 px-6 py-4">
                                                        Finished
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredTakes.map(
                                                    (take, index) => (
                                                        <tr
                                                            key={
                                                                take.id ?? index
                                                            }
                                                            className="transition hover:bg-slate-50"
                                                        >
                                                            <td className="border-b border-slate-100 px-6 py-5 align-top">
                                                                <p className="font-semibold text-slate-900">
                                                                    {take.quiz
                                                                        ?.title ??
                                                                        "Quiz title"}
                                                                </p>
                                                            </td>
                                                            <td className="border-b border-slate-100 px-6 py-5 text-center">
                                                                <span
                                                                    className={
                                                                        "inline-flex rounded-full px-3 py-1 text-sm font-semibold " +
                                                                        scoreBadgeClass(
                                                                            take.score,
                                                                        )
                                                                    }
                                                                >
                                                                    {take.score ??
                                                                        "-"}
                                                                    %
                                                                </span>
                                                            </td>
                                                            <td className="border-b border-slate-100 px-6 py-5 text-sm text-slate-600">
                                                                {take.started_at ??
                                                                    "-"}
                                                            </td>
                                                            <td className="border-b border-slate-100 px-6 py-5 text-sm text-slate-600">
                                                                {take.finished_at ??
                                                                    "-"}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="grid gap-4 p-4 lg:hidden">
                                        {filteredTakes.map((take, index) => (
                                            <div
                                                key={take.id ?? index}
                                                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <h3 className="font-semibold text-slate-900">
                                                        {take.quiz?.title ??
                                                            "Quiz title"}
                                                    </h3>
                                                    <span
                                                        className={
                                                            "shrink-0 rounded-full px-3 py-1 text-sm font-semibold " +
                                                            scoreBadgeClass(
                                                                take.score,
                                                            )
                                                        }
                                                    >
                                                        {take.score ?? "-"}%
                                                    </span>
                                                </div>
                                                <div className="mt-4 grid gap-2 text-sm text-slate-600">
                                                    <p>
                                                        <span className="font-semibold text-slate-800">
                                                            Started:
                                                        </span>{" "}
                                                        {take.started_at ?? "-"}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold text-slate-800">
                                                            Finished:
                                                        </span>{" "}
                                                        {take.finished_at ??
                                                            "-"}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="p-12 text-center">
                                    <p className="text-lg font-semibold text-slate-900">
                                        No quizzes match your filters
                                    </p>
                                    <p className="mt-3 text-sm text-slate-500">
                                        Try another search term or clear the
                                        filters.
                                    </p>
                                </div>
                            )
                        ) : (
                            <div className="p-12 text-center">
                                <p className="text-lg font-semibold text-slate-900">
                                    No completed quizzes yet
                                </p>
                                <p className="mt-3 text-sm text-slate-500">
                                    Start a quiz and your results will appear
                                    here.
                                </p>
                                <Link
                                    href={route("participant.new_quiz")}
                                    className="mt-6 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                >
                                    Find a quiz
                                </Link>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </ParticipantLayout>
    );
}
