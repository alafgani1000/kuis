import { Link } from "@inertiajs/react";
import ParticipantLayout from "@/Layouts/ParticipanLayout";
import { useEffect } from "react";

export default function Score({ auth, take }) {
    const deleteLocalStorageData = () => {
        if (!take?.quiz_id) {
            return;
        }

        localStorage.removeItem("quiz" + take.quiz_id);
        localStorage.removeItem("quiz" + take.quiz_id + "_index");
        localStorage.removeItem("quiz" + take.quiz_id + "_skip");
        localStorage.removeItem("quiz" + take.quiz_id + "_current");
        localStorage.removeItem("quiz" + take.quiz_id + "_count_choosed");
        localStorage.removeItem("quizLastTimeChoice" + take.quiz_id);
        localStorage.removeItem("quizStartTime" + take.quiz_id);
    };

    useEffect(() => {
        deleteLocalStorageData();
    }, [take?.quiz_id]);

    const title = take?.quiz?.title ?? "Quiz";
    const score = take?.score ?? 0;
    const scoreMessage =
        score >= 80
            ? "Fantastic work!"
            : score >= 50
              ? "Nice job, keep practicing!"
              : "Good effort, try again for a better score.";

    return (
        <ParticipantLayout auth={auth}>
            <div className="min-h-screen bg-slate-50 py-10">
                <div className="mx-auto max-w-screen-lg px-6">
                    <div className="rounded-[32px] bg-white p-8 shadow-xl shadow-slate-200">
                        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">
                                    Quiz result
                                </p>
                                <h1 className="mt-3 text-4xl font-semibold text-slate-900">
                                    Great job!
                                </h1>
                                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                                    You finished{" "}
                                    <span className="font-semibold text-slate-900">
                                        {title}
                                    </span>
                                    . Your score is available below, and your
                                    progress has been saved.
                                </p>
                            </div>
                            <div className="rounded-[32px] bg-slate-50 px-8 py-6 text-center shadow-sm shadow-slate-200">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                                    Your score
                                </p>
                                <p className="mt-4 text-6xl font-semibold text-slate-950">
                                    {score}
                                </p>
                                <p className="mt-3 text-sm text-slate-600">
                                    {scoreMessage}
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-3xl bg-sky-50 p-5">
                                <p className="text-xs uppercase tracking-[0.3em] text-sky-600">
                                    Quiz
                                </p>
                                <p className="mt-3 text-lg font-semibold text-slate-900">
                                    {title}
                                </p>
                            </div>
                            <div className="rounded-3xl bg-emerald-50 p-5">
                                <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
                                    Started at
                                </p>
                                <p className="mt-3 text-lg font-semibold text-slate-900">
                                    {take?.started_at ?? "-"}
                                </p>
                            </div>
                            <div className="rounded-3xl bg-amber-50 p-5">
                                <p className="text-xs uppercase tracking-[0.3em] text-amber-700">
                                    Finished at
                                </p>
                                <p className="mt-3 text-lg font-semibold text-slate-900">
                                    {take?.finished_at ?? "-"}
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            <Link
                                href={route("participant.dashboard")}
                                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                View dashboard
                            </Link>
                            <Link
                                href={route("home")}
                                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                            >
                                Back to home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </ParticipantLayout>
    );
}
