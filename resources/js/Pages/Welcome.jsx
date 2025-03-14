import { Link, Head } from "@inertiajs/react";
import MultipeChoice from "./QuestionTypes/MultipleChoice";
import MultipleResponse from "./QuestionTypes/MultipleResponse";
import { questions } from "@/Components/js/questions_example";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-center bg-white dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <div className="max-w-7xl mx-auto p-6 lg:p-8">
                    <div className="flex justify-center">
                        {/* multiple choice */}
                        {questions.map((question, index) => {
                            return (
                                <MultipleResponse
                                    question={question}
                                    key={question.id}
                                />
                            );
                        })}
                    </div>

                    <div className="flex justify-center mt-16 px-6 sm:items-center sm:justify-between">
                        <div className="text-center text-sm sm:text-start">
                            &nbsp;
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
