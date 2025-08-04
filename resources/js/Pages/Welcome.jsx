import { Link, Head } from "@inertiajs/react";
import ParticipantLayout from "@/Layouts/ParticipanLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { data } from "autoprefixer";

export default function Welcome({
    auth,
    canLogin,
    laravelVersion,
    phpVersion,
}) {
    const [quizes, setQuizes] = useState([]);
    const [categories, setCategories] = useState([]);

    // get category quizes
    useEffect(() => {
        // get category quizes
        axios.get("/quiz/category").then((response) => {
            const { data } = response;
            setCategories(data);
        });

        // get new quiz
        axios.get("/quiz/new").then((response) => {
            const { data } = response;
            setQuizes(data);
        });
    }, []);

    return (
        <ParticipantLayout auth={auth}>
            <div className="px-8 lg:px-0 ">
                <div className="max-w-screen-lg mx-auto px-0 space-y-6 my-4 mt-8 flex">
                    <div className="bg-white py-4 font-medium text-gray-800 rounded-t-xl rounded-bl-xl">
                        Hi Welcome, <br />
                        Let's start play, learn and explore
                    </div>
                </div>

                <div className="max-w-screen-lg mx-auto mt-10 text-xl font-semibold grid grid-cols-1 space-x-3 text-gray-700">
                    New Quiz
                </div>
                <div className="max-w-screen-lg mx-auto my-4 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 px-8 py-8 bg-background bg-cover gap-6 rounded-lg">
                    {quizes.map((quiz, index) => {
                        return (
                            <div className="bg-white px-4 py-4 font-medium text-gray-800 h-48 grid place-items-center rounded-md">
                                <div className="w-full text-center text-xl text-gray-800">
                                    {quiz.title}
                                    <div className="flex items-center justify-center space-x-1 mt-4">
                                        <div className="bg-stone-400 text-white font-medium rounded-full px-2 py-1 text-xs">
                                            {quiz.category?.name}
                                        </div>
                                        <div className="bg-stone-400 text-white font-medium rounded-full px-2 py-1 text-xs">
                                            {quiz.questions_count} Question
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* category */}
                <div className="max-w-screen-lg mx-auto mt-10 text-xl font-semibold grid text-gray-700">
                    Quiz Categories
                </div>
                <div className="max-w-screen-lg mx-auto my-4 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 bg-background bg-cover px-6 py-6 rounded-lg ">
                    {categories.map((category, index) => {
                        return (
                            <div className="bg-white px-4 py-4 font-medium text-gray-800 h-32 grid place-items-center rounded-md">
                                <div className="w-full text-center text-xl text-gray-800">
                                    {category.name}
                                    <div className="flex items-center justify-center space-x-1 mt-4">
                                        <div className="bg-stone-400 text-white font-medium rounded-full px-2 py-1 text-xs">
                                            {category.quizzes_count} Quiz
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </ParticipantLayout>
    );
}
