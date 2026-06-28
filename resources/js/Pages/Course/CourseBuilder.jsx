import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";

function RichTextEditor({ value = "", onChange }) {
    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const syncContent = () => {
        onChange(editorRef.current?.innerHTML ?? "");
    };

    const command = (name, commandValue = null) => {
        document.execCommand(name, false, commandValue);
        syncContent();
        editorRef.current?.focus();
    };

    const setBlock = (event) => {
        command("formatBlock", event.target.value);
        event.target.value = "P";
    };

    const addLink = () => {
        const url = window.prompt("Masukkan URL link");

        if (url) {
            command("createLink", url);
        }
    };

    const addImage = () => {
        const url = window.prompt("Masukkan URL gambar");

        if (url) {
            command("insertImage", url);
        }
    };

    return (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2">
                <select
                    onChange={setBlock}
                    defaultValue="P"
                    className="h-9 rounded-md border-slate-200 py-1 text-xs font-semibold text-slate-700"
                    title="Text style"
                >
                    <option value="P">Paragraph</option>
                    <option value="H2">Heading 2</option>
                    <option value="H3">Heading 3</option>
                    <option value="BLOCKQUOTE">Quote</option>
                </select>
                <button
                    type="button"
                    onClick={() => command("bold")}
                    className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
                    title="Bold"
                >
                    B
                </button>
                <button
                    type="button"
                    onClick={() => command("italic")}
                    className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm italic text-slate-700 hover:bg-slate-100"
                    title="Italic"
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={() => command("underline")}
                    className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm underline text-slate-700 hover:bg-slate-100"
                    title="Underline"
                >
                    U
                </button>
                <button
                    type="button"
                    onClick={() => command("insertUnorderedList")}
                    className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    title="Bullet list"
                >
                    List
                </button>
                <button
                    type="button"
                    onClick={() => command("insertOrderedList")}
                    className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    title="Numbered list"
                >
                    1.
                </button>
                <button
                    type="button"
                    onClick={addLink}
                    className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    title="Insert link"
                >
                    Link
                </button>
                <button
                    type="button"
                    onClick={addImage}
                    className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    title="Insert image URL"
                >
                    Image
                </button>
                <button
                    type="button"
                    onClick={() => command("removeFormat")}
                    className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    title="Clear formatting"
                >
                    Clear
                </button>
            </div>
            <div
                ref={editorRef}
                contentEditable
                onInput={syncContent}
                className="min-h-40 px-4 py-3 text-sm leading-6 text-slate-700 outline-none [&_a]:text-emerald-700 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-300 [&_blockquote]:pl-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-lg [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
                suppressContentEditableWarning
            />
        </div>
    );
}

export default function CourseBuilder({ auth, course, availableQuizzes = [] }) {
    const [lessonForm, setLessonForm] = useState({
        title: "",
        description: "",
    });
    const [sublessonForms, setSublessonForms] = useState({});
    const [quizForm, setQuizForm] = useState({
        quiz_id: "",
        sort_order: 0,
        required: true,
    });
    const [editingSublesson, setEditingSublesson] = useState(null);
    const [activeTab, setActiveTab] = useState("lessons");

    const refresh = () => {
        router.reload({ preserveScroll: true });
    };

    const saveLesson = (event) => {
        event.preventDefault();
        axios
            .post(`/admin/course/${course.id}/lesson`, lessonForm)
            .then(() => {
                setLessonForm({ title: "", description: "" });
                refresh();
            });
    };

    const saveSublesson = (event, lessonId) => {
        event.preventDefault();

        const form = sublessonForms[lessonId] ?? { title: "", content: "" };
        const request = editingSublesson?.lessonId === lessonId
            ? axios.put(
                `/admin/course/${course.id}/lesson/${lessonId}/sublesson/${editingSublesson.id}`,
                form,
            )
            : axios.post(
                `/admin/course/${course.id}/lesson/${lessonId}/sublesson`,
                form,
            );

        request
            .then(() => {
                setSublessonForms({
                    ...sublessonForms,
                    [lessonId]: { title: "", content: "" },
                });
                setEditingSublesson(null);
                refresh();
            });
    };

    const editSublesson = (lessonId, sublesson) => {
        setEditingSublesson({ lessonId, id: sublesson.id });
        setSublessonForms({
            ...sublessonForms,
            [lessonId]: {
                title: sublesson.title,
                content: sublesson.content,
            },
        });
    };

    const cancelSublessonEdit = (lessonId) => {
        setEditingSublesson(null);
        setSublessonForms({
            ...sublessonForms,
            [lessonId]: { title: "", content: "" },
        });
    };

    const attachQuiz = (event) => {
        event.preventDefault();
        axios.post(`/admin/course/${course.id}/quiz`, quizForm).then(() => {
            setQuizForm({ quiz_id: "", sort_order: 0, required: true });
            refresh();
        });
    };

    const deleteLesson = (lessonId) => {
        axios
            .delete(`/admin/course/${course.id}/lesson/${lessonId}`)
            .then(() => refresh());
    };

    const deleteSublesson = (lessonId, sublessonId) => {
        axios
            .delete(
                `/admin/course/${course.id}/lesson/${lessonId}/sublesson/${sublessonId}`,
            )
            .then(() => refresh());
    };

    const detachQuiz = (quizId) => {
        axios
            .delete(`/admin/course/${course.id}/quiz/${quizId}`)
            .then(() => refresh());
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="leading-tight">Course Builder</h2>}
        >
            <Head title={`${course.title} Builder`} />

            <div className="py-6 lg:py-10">
                <div className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <Link
                        href={route("course.index")}
                        className="text-sm font-semibold text-emerald-700"
                    >
                        Back to courses
                    </Link>
                    <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                                Build course
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold text-slate-950">
                                {course.title}
                            </h1>
                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                                {course.description}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
                            <div className="rounded-2xl bg-slate-50 px-5 py-4">
                                <p className="text-2xl font-semibold text-slate-950">
                                    {course.lessons.length}
                                </p>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                    Lessons
                                </p>
                            </div>
                            <div className="rounded-2xl bg-cyan-50 px-5 py-4">
                                <p className="text-2xl font-semibold text-slate-950">
                                    {course.quizzes.length}
                                </p>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                                    Quizzes
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6 flex gap-4 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab("lessons")}
                        className={`border-b-2 px-4 py-2 text-sm font-semibold ${
                            activeTab === "lessons"
                                ? "border-emerald-600 text-emerald-700"
                                : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        Lessons
                    </button>
                    <button
                        onClick={() => setActiveTab("quizzes")}
                        className={`border-b-2 px-4 py-2 text-sm font-semibold ${
                            activeTab === "quizzes"
                                ? "border-emerald-600 text-emerald-700"
                                : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        Course Quizzes
                    </button>
                </div>

                <div>
                    {activeTab === "lessons" && (
                    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-950">
                            Lessons
                        </h2>
                        <form
                            onSubmit={saveLesson}
                            className="mt-5 grid gap-3 rounded-lg bg-slate-50 p-4"
                        >
                            <input
                                value={lessonForm.title}
                                onChange={(event) =>
                                    setLessonForm({
                                        ...lessonForm,
                                        title: event.target.value,
                                    })
                                }
                                placeholder="Lesson title"
                                className="rounded-md border-slate-200 text-sm"
                                required
                            />
                            <textarea
                                value={lessonForm.description}
                                onChange={(event) =>
                                    setLessonForm({
                                        ...lessonForm,
                                        description: event.target.value,
                                    })
                                }
                                placeholder="Lesson description"
                                className="rounded-md border-slate-200 text-sm"
                                rows="3"
                            />
                            <div className="flex justify-end">
                                <button className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                                    Add lesson
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 space-y-4">
                            {course.lessons.length > 0 ? (
                                course.lessons.map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        className="rounded-lg border border-slate-200 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="font-semibold text-slate-900">
                                                    {lesson.title}
                                                </h3>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {lesson.description}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    deleteLesson(lesson.id)
                                                }
                                                className="rounded-md bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700"
                                            >
                                                Delete
                                            </button>
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            {lesson.sublessons.map(
                                                (sublesson) => (
                                                    <div
                                                        key={sublesson.id}
                                                        className="rounded-md bg-slate-50 p-3"
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <p className="font-semibold text-slate-800">
                                                                    {
                                                                        sublesson.title
                                                                    }
                                                                </p>
                                                                <div
                                                                    className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500 [&_a]:text-emerald-700 [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-300 [&_blockquote]:pl-4 [&_img]:my-2 [&_img]:max-w-full [&_img]:rounded-lg [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: sublesson.content,
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="flex shrink-0 gap-2">
                                                                <button
                                                                    onClick={() =>
                                                                        editSublesson(
                                                                            lesson.id,
                                                                            sublesson,
                                                                        )
                                                                    }
                                                                    className="text-sm font-semibold text-amber-600"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        deleteSublesson(
                                                                            lesson.id,
                                                                            sublesson.id,
                                                                        )
                                                                    }
                                                                    className="text-sm font-semibold text-rose-600"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>

                                        <form
                                            onSubmit={(event) =>
                                                saveSublesson(event, lesson.id)
                                            }
                                            className="mt-4 grid gap-3 rounded-md border border-dashed border-slate-300 p-3"
                                        >
                                            <input
                                                value={
                                                    sublessonForms[lesson.id]
                                                        ?.title ?? ""
                                                }
                                                onChange={(event) =>
                                                    setSublessonForms({
                                                        ...sublessonForms,
                                                        [lesson.id]: {
                                                            ...(sublessonForms[
                                                                lesson.id
                                                            ] ?? {}),
                                                            title: event.target
                                                                .value,
                                                        },
                                                    })
                                                }
                                                placeholder="Sublesson title"
                                                className="rounded-md border-slate-200 text-sm"
                                                required
                                            />
                                            <RichTextEditor
                                                value={
                                                    sublessonForms[lesson.id]
                                                        ?.content ?? ""
                                                }
                                                onChange={(content) =>
                                                    setSublessonForms({
                                                        ...sublessonForms,
                                                        [lesson.id]: {
                                                            ...(sublessonForms[
                                                                lesson.id
                                                            ] ?? {}),
                                                            content,
                                                        },
                                                    })
                                                }
                                            />
                                            <div className="flex justify-end gap-2">
                                                {editingSublesson?.lessonId ===
                                                    lesson.id && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            cancelSublessonEdit(
                                                                lesson.id,
                                                            )
                                                        }
                                                        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                                                    >
                                                        Cancel edit
                                                    </button>
                                                )}
                                                <button className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">
                                                    {editingSublesson?.lessonId ===
                                                    lesson.id
                                                        ? "Update sublesson"
                                                        : "Add sublesson"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                                    No lessons yet.
                                </div>
                            )}
                        </div>
                    </section>
                    )}

                    {activeTab === "quizzes" && (
                    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-950">
                            Course quizzes
                        </h2>
                        <form
                            onSubmit={attachQuiz}
                            className="mt-5 grid gap-3 rounded-lg bg-cyan-50 p-4"
                        >
                            <select
                                value={quizForm.quiz_id}
                                onChange={(event) =>
                                    setQuizForm({
                                        ...quizForm,
                                        quiz_id: event.target.value,
                                    })
                                }
                                className="rounded-md border-slate-200 text-sm"
                                required
                            >
                                <option value="">Select quiz</option>
                                {availableQuizzes.map((quiz) => (
                                    <option key={quiz.id} value={quiz.id}>
                                        {quiz.title}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                min="0"
                                value={quizForm.sort_order}
                                onChange={(event) =>
                                    setQuizForm({
                                        ...quizForm,
                                        sort_order: event.target.value,
                                    })
                                }
                                className="rounded-md border-slate-200 text-sm"
                                placeholder="Sort order"
                            />
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={quizForm.required}
                                    onChange={(event) =>
                                        setQuizForm({
                                            ...quizForm,
                                            required: event.target.checked,
                                        })
                                    }
                                    className="rounded border-slate-300 text-emerald-600"
                                />
                                Required quiz
                            </label>
                            <div className="flex justify-end">
                                <button className="rounded-md bg-cyan-700 px-4 py-2 text-sm font-semibold text-white">
                                    Attach quiz
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 space-y-3">
                            {course.quizzes.length > 0 ? (
                                course.quizzes.map((quiz) => (
                                    <div
                                        key={quiz.id}
                                        className="rounded-lg border border-slate-200 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    {quiz.title}
                                                </p>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                        {quiz.questions_count}{" "}
                                                        questions
                                                    </span>
                                                    <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-700">
                                                        {quiz.category?.name ??
                                                            "General"}
                                                    </span>
                                                    {quiz.pivot?.required ? (
                                                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                            Required
                                                        </span>
                                                    ) : (
                                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                            Optional
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    detachQuiz(quiz.id)
                                                }
                                                className="rounded-md bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                                    No quizzes attached yet.
                                </div>
                            )}
                        </div>
                    </section>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
