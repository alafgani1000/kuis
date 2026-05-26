import { Link, Head } from "@inertiajs/react";
import ParticipantLayout from "@/Layouts/ParticipanLayout";

export default function NewQuiz({ auth, quizes = [] }) {
    return (
        <ParticipantLayout auth={auth}>
            <Head title="New Quizzes" />
            <div className="min-h-screen bg-slate-50 py-10">
                <div className="mx-auto max-w-screen-lg px-6">
                    <div className="mb-8 rounded-[32px] bg-white p-8 shadow-lg shadow-slate-200">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">
                                    New quizzes
                                </p>
                                <h1 className="mt-3 text-4xl font-semibold text-slate-900">
                                    Latest challenges
                                </h1>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                                    Explore the freshest quizzes and choose the
                                    one that fits your interests.
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
                        {quizes.length > 0 ? (
                            quizes.map((quiz, index) => (
                                <Link
                                    key={quiz.id ?? index}
                                    href={route(
                                        "participant.take_quiz",
                                        quiz.id,
                                    )}
                                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div
                                        className="relative h-56 overflow-hidden bg-cover bg-center transition duration-500 group-hover:scale-105"
                                        style={{
                                            backgroundImage: `url(/storage/${quiz.thumbnail})`,
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-xl font-semibold text-slate-900">
                                            {quiz.title}
                                        </h3>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                                                {quiz.category?.name ??
                                                    "General"}
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                {quiz.questions_count} questions
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                {quiz.time_limit} min
                                            </span>
                                        </div>
                                        <div className="mt-6 inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition group-hover:bg-slate-800">
                                            Take quiz
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500 shadow-sm">
                                No quizzes available yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ParticipantLayout>
    );
}
