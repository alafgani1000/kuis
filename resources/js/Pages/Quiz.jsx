import { Link, Head } from "@inertiajs/react";
import MultipeChoice from "./QuestionTypes/MultipleChoice";
import MultipleResponse from "./QuestionTypes/MultipleResponse";
import { questions } from "@/Components/js/questions_example";
import ShortAnswer from "./QuestionTypes/ShortAnswer";
import { useEffect, useState } from "react";
import MultipleChoice from "./QuestionTypes/MultipleChoice";

export default function Quiz({ quiz, auth, laravelVersion, phpVersion }) {
    const [questions, setQuestions] = useState(quiz.questions);
    const [currentQuestion, setCurrentQuestion] = useState({});
    const [index, setIndex] = useState(0);

    useEffect(() => {
        setCurrentQuestion(questions[index]);
    }, [index]);

    const nextQuestion = () => {
        let newIndex = index + 1;
        setIndex(newIndex);
    };

    const prevQuestion = () => {
        let newIndex = index - 1;
        setIndex(newIndex);
    };
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
                            1 from 50
                        </div>
                        <div className="text-center text-sm sm:text-start font-semibold">
                            Timeleft: 50 minute
                        </div>
                    </div>
                    <div className="flex justify-center mt-8 p-6 lg:p-8">
                        {/* multiple choice */}
                        {currentQuestion?.type?.code === "multiple_choice" ? (
                            <MultipleChoice
                                question={currentQuestion}
                                key={currentQuestion.id}
                            />
                        ) : currentQuestion?.type?.code ===
                          "multiple_response" ? ( // multiple response
                            <MultipleResponse
                                question={currentQuestion}
                                key={currentQuestion.id}
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
        </>
    );
}
