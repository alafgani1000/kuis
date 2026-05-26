import { Link, Head, router } from "@inertiajs/react";
import MultipleResponse from "./QuestionTypes/MultipleResponse";
import ShortAnswer from "./QuestionTypes/ShortAnswer";
import { useEffect, useState } from "react";
import MultipleChoice from "./QuestionTypes/MultipleChoice";
import QuizTimer from "@/Components/QuizTimer";
import Modal from "@/Components/Modal";
import axios from "axios";
import Alert from "@/Components/Alert";

export default function Quiz({
    quiz,
    auth,
    laravelVersion,
    phpVersion,
    take,
    courseId = null,
}) {
    const [questions, setQuestions] = useState(
        take == null ? quiz.questions : take.questions,
    );
    const [currentQuestion, setCurrentQuestion] = useState(
        take == null ? {} : take.currentQuestion,
    );
    const [countQuestion, setCountQuestion] = useState(0);
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
    const [modalQuizEnd, setModalQuizEnd] = useState(false);
    const [questionSkip, setQuestionSkip] = useState(
        take == null ? [] : take.questionSkip,
    );
    const [index, setIndex] = useState(take == null ? 0 : take.index);
    const [quizLastTimeChoice, setQuizLastTimeChoice] = useState(null);
    const [pleasePick, setPleasePick] = useState("");
    const [countQuestionChosed, setCountQuestionChosed] = useState(
        take == null ? 0 : take.countQuestionChosed,
    );
    const [startQuiz, setStartQuiz] = useState(false);
    const [timeLimit, setTimeLimit] = useState(null);
    const [lastActivity, setLastActivity] = useState(Date.now());
    const [result, setResult] = useState();
    const [quizEnd, setQuizEnd] = useState(false);

    const handleTimeUpdate = (timeLeft) => {
        setTimeLimit(timeLeft);

        // You can also trigger other logic here (e.g., auto-submit when timeLeft === 0)
    };

    const isQuestionAnswered = (question) => {
        if (
            !question ||
            question.pick_answers === undefined ||
            question.pick_answers === null
        ) {
            return false;
        }

        if (Array.isArray(question.pick_answers)) {
            return question.pick_answers.length > 0;
        }

        if (typeof question.pick_answers === "string") {
            return question.pick_answers.trim().length > 0;
        }

        return true;
    };

    const findNextUnansweredIndex = (fromIndex = 0) => {
        for (let i = fromIndex + 1; i < questions.length; i++) {
            if (
                !isQuestionAnswered(questions[i]) &&
                !questionSkip.includes(i)
            ) {
                return i;
            }
        }

        for (let i = 0; i <= fromIndex; i++) {
            if (
                !isQuestionAnswered(questions[i]) &&
                !questionSkip.includes(i)
            ) {
                return i;
            }
        }

        return null;
    };

    /**
     * start quiz
     * check if quiz start time is exist in local storage
     */
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (localStorage.getItem("quizStartTime" + quiz.id) != null) {
                setStartQuiz(true);
                clearInterval(intervalId);
            }
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    /**
     * if index changed, set current question, question choosed cound , and count question
     * call saveTolocalStorage
     */
    useEffect(() => {
        setCurrentQuestion(questions[index] ?? {});
        setCountQuestion(quiz.questions.length);

        let answeredCount = questions.filter(isQuestionAnswered).length;
        setCountQuestionChosed(answeredCount);
        setCurrentQuestionNumber(index + 1);
    }, [index, questions]);

    useEffect(() => {
        saveTolocalStorage();
    }, [questions, index, questionSkip, currentQuestion, countQuestionChosed]);

    useEffect(() => {
        if (startQuiz === true) {
            let startTime = localStorage.getItem("quizStartTime" + quiz.id);
            const elapsedTime = Math.floor(
                (Date.now() - startTime) / (1000 * 60),
            );
            const remainingTime = elapsedTime - quiz.time_limit;
            if (quizEnd === false) {
                if (remainingTime >= 0) {
                    setQuizEnd(true);
                }
            }
        }
    }, [timeLimit, startQuiz]);

    // get result from server
    useEffect(() => {
        if (result) {
            router.visit(`/quiz/${result.data.id}/score`, {
                preserveScroll: true,
                replace: true,
            });
        }
    }, [result]);

    // quiz end
    useEffect(() => {
        if (quizEnd === true) {
            evaluateQuiz();
        }
    }, [quizEnd]);

    /**
     * sync answers every seconds
     * break if last activity is less than 10 seconds
     */
    useEffect(() => {
        if (quizEnd === false) {
            const syncInterval = setInterval(() => {
                if (Date.now() - lastActivity < 10000) {
                    syncAnswers();
                }
            }, 1000);
            return () => clearInterval(syncInterval);
        }
    }, [lastActivity, quizEnd]);

    /**
     * save data to local storage
     */
    const saveTolocalStorage = () => {
        localStorage.setItem("quiz" + quiz.id, JSON.stringify(questions));
        localStorage.setItem(
            "quiz" + quiz.id + "_index",
            JSON.stringify(index),
        );
        localStorage.setItem(
            "quiz" + quiz.id + "_skip",
            JSON.stringify(questionSkip),
        );
        localStorage.setItem(
            "quiz" + quiz.id + "_current",
            JSON.stringify(currentQuestion),
        );
        localStorage.setItem(
            "quiz" + quiz.id + "_count_choosed",
            JSON.stringify(countQuestionChosed),
        );
    };

    /**
     * sync answers
     * this prevent if local storage is empty
     */
    const syncAnswers = () => {
        axios.post("/quiz/sync-answers", {
            quiz_id: quiz.id,
            quiz_data: {
                questions: questions,
                index: index,
                questionSkip: questionSkip,
                currentQuestion: currentQuestion,
                countQuestionChosed: countQuestionChosed,
            },
            quiz_end: quizEnd,
        });
    };

    /**
     * next question
     * check if question not answered
     *
     */
    const nextQuestion = () => {
        setLastActivity(Date.now());
        if (!isQuestionAnswered(currentQuestion)) {
            setPleasePick("Please choose an answer or skip");
            return;
        }

        setPleasePick("");
        if (questions.length === countQuestionChosed + questionSkip.length) {
            if (questionSkip.length > 0) {
                setIndex(questionSkip[0]);
                setQuestionSkip((prev) => prev.slice(1));
            } else {
                setQuizEnd(true);
            }
            return;
        }

        const nextIndex = findNextUnansweredIndex(index);
        if (nextIndex !== null) {
            setIndex(nextIndex);
        }
    };

    /**
     * skip question
     * @param {*} index
     */
    const skipQuestion = (currentIndex) => {
        setLastActivity(Date.now());
        setPleasePick("");

        if (questions.length === countQuestionChosed + questionSkip.length) {
            if (questionSkip.length === 0) {
                setPleasePick("This is the last question");
                return;
            }
            setIndex(questionSkip[0]);
            setQuestionSkip((prev) => prev.slice(1));
            return;
        }

        setQuestionSkip((prev) => [...prev, currentIndex]);
        const nextIndex = findNextUnansweredIndex(currentIndex);
        if (nextIndex !== null) {
            setIndex(nextIndex);
        } else if (questionSkip.length > 0) {
            setIndex(questionSkip[0]);
            setQuestionSkip((prev) => prev.slice(1));
        }
    };

    /**
     * multiple choice pick
     * @param {*} questionPick
     * @param {*} answer
     */
    const multiChoicePick = (questionPick, answer) => {
        const questionsMap = questions.map((question) => {
            if (question.id === questionPick.id) {
                return { ...question, pick_answers: answer };
            }
            return question;
        });
        setQuestions(questionsMap);
        setPleasePick("");
        localStorage.setItem(
            "quizLastTimeChoice" + quiz.id,
            JSON.stringify(new Date()),
        );
    };

    /**
     * multiple response pick
     * @param {*} questionPick
     * @param {*} answer
     */
    const multiResponsePick = (questionPick, answer) => {
        const questionsMap = questions.map((question) => {
            if (question.id === questionPick.id) {
                const selectedAnswers = Array.isArray(question.pick_answers)
                    ? question.pick_answers
                    : [];
                const nextAnswers = selectedAnswers.includes(answer)
                    ? selectedAnswers.filter((item) => item !== answer)
                    : [...selectedAnswers, answer];
                return { ...question, pick_answers: nextAnswers };
            }
            return question;
        });
        setQuestions(questionsMap);
        setPleasePick("");
        localStorage.setItem(
            "quizLastTimeChoice" + quiz.id,
            JSON.stringify(new Date()),
        );
    };

    /**
     * shoart answer pick
     * @param {*} questionPick
     * @param {*} answer
     */
    const shortAnswerPick = (questionPick, answer) => {
        const questionsMap = questions.map((question) => {
            if (question.id === questionPick.id) {
                return { ...question, pick_answers: answer };
            }
            return question;
        });
        setQuestions(questionsMap);
        setPleasePick("");
        localStorage.setItem(
            "quizLastTimeChoice" + quiz.id,
            JSON.stringify(new Date()),
        );
    };

    /**
     * evaluate quiz and show score modal
     */
    const evaluateQuiz = () => {
        axios
            .put("/quiz/" + quiz.id + "/evaluate", {
                course_id: courseId,
                quiz_data: {
                    questions: questions,
                    index: index,
                    questionSkip: questionSkip,
                    currentQuestion: currentQuestion,
                    countQuestionChosed: countQuestionChosed,
                },
                quiz: questions,
                quiz_end: quizEnd,
            })
            .then((res) => {
                setResult(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="flex items-center justify-center mt-8 bg-white dark:bg-dots-lighter dark:bg-gray-50 selection:bg-red-500 selection:text-white">
                <div className="xl:w-3/5 lg:w-full md:w-full w-full md:mx-4 mx-4 border shadow rounded-lg py-5 h-3/5">
                    <div className="flex px-6 justify-between">
                        <div className="text-center text-sm sm:text-start font-semibold">
                            {countQuestionChosed} from {countQuestion}
                        </div>
                        <QuizTimer
                            durationInMinutes={quiz.time_limit}
                            onTimeUpdate={handleTimeUpdate}
                            quizId={quiz.id}
                        />
                    </div>

                    {/* alert please pick */}
                    <div className="flex justify-center p-6 lg:p-8">
                        <Alert
                            message={pleasePick}
                            className="bg-red-600 text-white py-2 px-3 rounded-md"
                        />
                    </div>

                    {/* show question */}
                    <div className="flex justify-center p-6 lg:p-8">
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
                                onAnswering={shortAnswerPick}
                            />
                        ) : (
                            <></>
                        )}
                    </div>

                    {/* skip and next question */}
                    <div className="flex justify-center mt-8 px-6 space-x-8">
                        <div
                            onClick={(e) => skipQuestion(index)}
                            className="text-center text-sm sm:text-start bg-gray-400 px-8 py-2 text-white rounded-full cursor-pointer"
                        >
                            Skip
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
                <div className="bg-white rounded w-full md:w-3/5 lg:w-2/5 sm:w-full mx-auto">
                    <div className="flex flex-col items-end m-0 p-0">
                        <button
                            onClick={() => setModalQuizEnd(false)}
                            className="bg-zinc-700 px-3 py-1 text-white hover:bg-rose-600 rounded-tr"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <form className="px-6 pb-6 text-center">
                        <h2 className="text-lg font-medium text-gray-900">
                            Quiz Result
                        </h2>
                        <h4>Congrulations, you have finished the quiz.</h4>

                        <div className="grid mt-4"></div>
                        <h6>Your Score</h6>
                        <h4>{result?.score}</h4>
                    </form>
                </div>
            </Modal>
        </>
    );
}
