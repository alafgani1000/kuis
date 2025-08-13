import { Link, Head } from "@inertiajs/react";
import MultipeChoice from "./QuestionTypes/MultipleChoice";
import MultipleResponse from "./QuestionTypes/MultipleResponse";
import { questions } from "@/Components/js/questions_example";
import ShortAnswer from "./QuestionTypes/ShortAnswer";
import { useEffect, useState } from "react";
import MultipleChoice from "./QuestionTypes/MultipleChoice";
import QuizTimer from "@/Components/QuizTimer";
import Modal from "@/Components/Modal";
import axios from "axios";

export default function Quiz({ quiz, auth, laravelVersion, phpVersion }) {
    const [questions, setQuestions] = useState(quiz.questions);
    const [currentQuestion, setCurrentQuestion] = useState({});
    const [countQuestion, setCountQuestion] = useState(0);
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
    const [modalQuizEnd, setModalQuizEnd] = useState(false);
    const [index, setIndex] = useState(0);
    const [quizLastTimeChoice, setQuizLastTimeChoice] = useState(null);

    const [timeLimit, setTimeLimit] = useState(null);

    const handleTimeUpdate = (timeLeft) => {
        setTimeLimit(timeLeft);
        if (timeLeft === 0) {
            setModalQuizEnd(true);
        }
        // You can also trigger other logic here (e.g., auto-submit when timeLeft === 0)
    };

    useEffect(() => {
        setCurrentQuestion(questions[index]);
        setCountQuestion(quiz.questions.length);
    }, [index]);

    useEffect(() => {
        const syncInterval = setInterval(() => {
            axios.post("/quiz/sync-answers", {
                quiz_id: quiz.id,
                questions: questions,
            });
        }, 15000);
        return () => clearInterval(syncInterval);
    }, [questions]);

    const nextQuestion = () => {
        let newIndex = index + 1;
        let newCurrentQuestionNumber = currentQuestionNumber + 1;
        setCurrentQuestionNumber(newCurrentQuestionNumber);
        setIndex(newIndex);
    };

    const prevQuestion = () => {
        let newIndex = index - 1;
        let newCurrentQuestionNumber = currentQuestionNumber - 1;
        setCurrentQuestionNumber(newCurrentQuestionNumber);
        setIndex(newIndex);
    };

    const multiChoicePick = (questionPick, answer) => {
        let questionsMap = questions.map((question) => {
            if (question.id === questionPick.id) {
                question.pick_answers = answer;
            }
            return question;
        });
        setQuestions(questionsMap);
        localStorage.setItem("quiz" + quiz.id, JSON.stringify(questionsMap));
        localStorage.setItem(
            "quizLastTimeChoice" + quiz.id,
            JSON.stringify(new Date())
        );
    };

    const multiResponsePick = (questionPick, answer) => {
        let questionsMap = questions.map((question) => {
            if (question.id === questionPick.id) {
                if (question.pick_answers === undefined) {
                    question.pick_answers = [];
                }
                if (question.pick_answers.includes(answer)) {
                    question.pick_answers = question.pick_answers.filter(
                        (item) => item !== answer
                    );
                } else {
                    question.pick_answers.push(answer);
                }
            }
            return question;
        });
        setQuestions(questionsMap);
        localStorage.setItem("quiz" + quiz.id, JSON.stringify(questionsMap));
        localStorage.setItem(
            "quizLastTimeChoice" + quiz.id,
            JSON.stringify(new Date())
        );
    };

    const shortAnswerPick = (questionPick, answer) => {
        let questionsMap = questions.map((question) => {
            if (question.id === questionPick.id) {
                question.pick_answers = answer;
            }
            return question;
        });
    };

    const handleSubmit = () => {};

    return (
        <>
            <Head title="Welcome" />
            <div className="flex justify-center mt-8 p-6 lg:p-8">
                {/* multiple choice */}
                {questions.map((question, index) => {
                    return <span key={index}>{index + 1}</span>;
                })}
            </div>
            <div className="flex items-center justify-center h-screen bg-white dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <div className="xl:w-3/5 lg:w-full md:w-full w-full md:mx-4 mx-4 border shadow rounded-lg py-5 h-3/5">
                    <div className="flex px-6 justify-between">
                        <div className="text-center text-sm sm:text-start font-semibold">
                            {currentQuestionNumber} from {countQuestion}
                        </div>
                        <QuizTimer
                            durationInMinutes={quiz.time_limit}
                            onTimeUpdate={handleTimeUpdate}
                        />
                    </div>
                    <div className="flex justify-center mt-8 p-6 lg:p-8">
                        {/* multiple choice */}
                        {currentQuestion?.type?.code === "multiple_choice" ? (
                            <MultipleChoice
                                question={currentQuestion}
                                key={currentQuestion.id}
                                onAnswering={multiChoicePick}
                            />
                        ) : currentQuestion?.type?.code ===
                          "multiple_response" ? ( // multiple response
                            <MultipleResponse
                                question={currentQuestion}
                                key={currentQuestion.id}
                                onAnswering={multiResponsePick}
                            />
                        ) : currentQuestion?.type?.code === "short_answer" ? ( // short answer
                            <ShortAnswer
                                question={currentQuestion}
                                key={currentQuestion.id}
                            />
                        ) : (
                            <></>
                        )}
                    </div>

                    <div className="flex justify-center mt-8 px-6 space-x-8">
                        <div
                            onClick={(e) => prevQuestion()}
                            className="text-center text-sm sm:text-start bg-emerald-600 px-8 py-2 text-white rounded-full cursor-pointer"
                        >
                            Prev
                        </div>
                        <div
                            onClick={(e) => nextQuestion()}
                            className="text-center text-sm sm:text-start bg-emerald-600 px-8 py-2 text-white rounded-full cursor-pointer"
                        >
                            Next
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={modalQuizEnd}>
                <div className="bg-white rounded w-full md:w-full lg:w-4/5 sm:w-full mx-auto">
                    <div className="flex flex-col items-end m-0 p-0">
                        <button
                            onClick={() => setModalQuizEnd(false)}
                            className="bg-zinc-700 px-3 py-1 text-white hover:bg-rose-600 rounded-tr"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <form className="px-6 pb-6">
                        <h2 className="text-lg font-medium text-gray-900">
                            Quiz Ended
                        </h2>
                        <div className="grid mt-4"></div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
