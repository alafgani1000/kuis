import { Link, Head } from "@inertiajs/react";
import MultipeChoice from "./QuestionTypes/MultipleChoice";
import MultipleResponse from "./QuestionTypes/MultipleResponse";
import { questions } from "@/Components/js/questions_example";
import ShortAnswer from "./QuestionTypes/ShortAnswer";

export default function Quiz({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />
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
                        {questions.map((question, index) => {
                            return (
                                <ShortAnswer
                                    question={question}
                                    key={question.id}
                                />
                            );
                        })}
                    </div>

                    <div className="flex justify-center mt-8 px-6 space-x-8">
                        <div className="text-center text-sm sm:text-start bg-blue-500 px-8 py-2 text-white rounded-full">
                            Prev
                        </div>
                        <div className="text-center text-sm sm:text-start bg-blue-500 px-8 py-2 text-white rounded-full">
                            Next
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
