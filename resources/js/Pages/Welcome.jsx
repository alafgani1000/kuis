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

                <div className="max-w-screen-lg mx-auto mt-4 text-xl font-semibold grid grid-cols-1 space-x-3 text-gray-700">
                    New Quiz
                </div>
                <div className="max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 py-8 bg-cover gap-6">
                    {quizes.map((quiz, index) => {
                        return (
                            <div className="bg-white shadow group" key={index}>
                                <div className="bg-white">
                                    <div
                                        className="h-60 px-4 py-4 font-medium text-gray-800 grid place-items-center bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(/storage/${quiz.thumbnail})`,
                                        }}
                                    >
                                        <Link
                                            href={route(
                                                "participant.take_quiz",
                                                quiz.id
                                            )}
                                            className="hidden justify-start space-x-1 mt-4 group-hover:flex bg-black text-white py-2 px-2 rounded-full"
                                        >
                                            Take Quiz
                                        </Link>
                                    </div>
                                    <div className="w-full text-md font-medium text-gray-800 px-4">
                                        <div className="mt-4">{quiz.title}</div>
                                        <div className="flex justify-between space-x-1 py-4 b">
                                            <div className="flex gap-2">
                                                <div className="bg-amber-400 text-white font-medium rounded-md px-2 py-1 text-xs">
                                                    {quiz.category?.name}
                                                </div>
                                                <div className="bg-amber-400 text-white font-medium rounded-md px-2 py-1 text-xs">
                                                    {quiz.questions_count}{" "}
                                                    Question
                                                </div>
                                            </div>
                                            <div className="bg-amber-400 text-white font-medium rounded-md px-2 py-1 text-xs">
                                                {quiz.time_limit}m
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* category */}
                <div className="max-w-screen-lg mx-auto mt-4 text-xl font-semibold grid text-gray-700">
                    Quiz Categories
                </div>
                <div className="max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 py-6 rounded-lg ">
                    {categories.map((category, index) => {
                        return (
                            <div>
                                <div
                                    className="bg-white px-4 py-4 font-medium text-gray-800 h-56 grid place-items-center rounded-t-md bg-cover bg-no-repeat bg-center"
                                    style={{
                                        backgroundImage: `url(/storage/${category.thumbnail})`,
                                    }}
                                    key={index}
                                ></div>
                                <div className="font-medium px-2 bg-emerald-500 text-white py-2">
                                    <div className="text-center text-xl text-gray-800">
                                        <div>{category.name}</div>
                                        {category.quizzes_count} Quiz
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
