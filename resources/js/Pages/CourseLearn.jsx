import { Head, Link } from "@inertiajs/react";
import ParticipantLayout from "@/Layouts/ParticipanLayout";
import parse from "html-react-parser";
import { useState } from "react";

export default function CourseLearn({ auth, course }) {
    const [expandedLessons, setExpandedLessons] = useState({});
    const [expandedSublessons, setExpandedSublessons] = useState({});

    const toggleLesson = (lessonId) => {
        setExpandedLessons((prev) => ({
            ...prev,
            [lessonId]: !prev[lessonId],
        }));
    };

    const toggleSublesson = (sublessonId) => {
        setExpandedSublessons((prev) => ({
            ...prev,
            [sublessonId]: !prev[sublessonId],
        }));
    };
    return (
        <ParticipantLayout auth={auth}>
            <Head title={`Learn ${course.title}`} />

            <div className="min-h-screen py-8 sm:py-10">
                <div className="mx-auto max-w-7xl px-6 lg:px-0">
                    <div className="mb-8 rounded-[32px] border border-emerald-100 bg-white p-8 shadow-lg shadow-slate-200/70">
                        <Link
                            href={route("participant.my_courses")}
                            className="text-sm font-semibold text-emerald-700"
                        >
                            Back to my courses
                        </Link>
                        <h1 className="mt-4 text-4xl font-semibold text-slate-950">
                            {course.title}
                        </h1>
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                            {course.description}
                        </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                        <section className="space-y-5">
                            {course.lessons.map((lesson) => (
                                <div
                                    key={lesson.id}
                                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                                >
                                    <div 
                                        className="flex cursor-pointer items-start justify-between gap-4" 
                                        onClick={() => toggleLesson(lesson.id)}
                                    >
                                        <div>
                                            <h2 className="text-xl font-semibold text-slate-900">
                                                {lesson.title}
                                            </h2>
                                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                                {lesson.description}
                                            </p>
                                        </div>
                                        <button className="mt-1 flex-shrink-0 text-slate-400 hover:text-slate-600">
                                            <svg 
                                                className={`h-6 w-6 transform transition-transform duration-200 ${expandedLessons[lesson.id] ? 'rotate-180' : ''}`} 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    {expandedLessons[lesson.id] && (
                                        <div className="mt-5 space-y-3">
                                            {lesson.sublessons.map((sublesson) => (
                                                <div
                                                    key={sublesson.id}
                                                    className="rounded-2xl bg-slate-50 p-4"
                                                >
                                                    <div 
                                                        className="flex cursor-pointer items-center justify-between"
                                                        onClick={() => toggleSublesson(sublesson.id)}
                                                    >
                                                        <h3 className="font-semibold text-slate-900">
                                                            {sublesson.title}
                                                        </h3>
                                                        <button className="flex-shrink-0 text-slate-400 hover:text-slate-600">
                                                            <svg 
                                                                className={`h-5 w-5 transform transition-transform duration-200 ${expandedSublessons[sublesson.id] ? 'rotate-180' : ''}`} 
                                                                fill="none" 
                                                                stroke="currentColor" 
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    
                                                    {expandedSublessons[sublesson.id] && (
                                                        <div className="mt-4 border-t border-slate-200 pt-4 text-sm leading-6 text-slate-600 [&_a]:text-emerald-700 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-300 [&_blockquote]:pl-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-lg [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6">
                                                            {parse(
                                                                sublesson.content ?? "",
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </section>

                        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-slate-900">
                                Quizzes
                            </h2>
                            <div className="mt-5 space-y-4">
                                {course.quizzes.length > 0 ? (
                                    course.quizzes.map((quiz) => (
                                        <div
                                            key={quiz.id}
                                            className="rounded-2xl border border-slate-200 p-4"
                                        >
                                            <h3 className="font-semibold text-slate-900">
                                                {quiz.title}
                                            </h3>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                                                    {quiz.questions_count}{" "}
                                                    questions
                                                </span>
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                    {quiz.time_limit} min
                                                </span>
                                            </div>
                                            <Link
                                                href={route(
                                                    "participant.course.quiz.start",
                                                    [course.id, quiz.id],
                                                )}
                                                className="mt-4 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                            >
                                                Take quiz
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500">
                                        This course does not have quizzes yet.
                                    </p>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </ParticipantLayout>
    );
}
