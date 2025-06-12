import { Link, Head } from "@inertiajs/react";
import ParticipantLayout from "@/Layouts/ParticipanLayout";

export default function Welcome({
    auth,
    canLogin,
    laravelVersion,
    phpVersion,
}) {
    return (
        <ParticipantLayout auth={auth}>
            <div className="max-w-screen-lg mx-auto px-0 space-y-6 my-4 mt-8 flex">
                <div className="bg-white px-8 py-4 font-medium text-gray-800 rounded-t-xl rounded-bl-xl">
                    Hi Welcome, <br />
                    Let's start play, learn and explore
                </div>
            </div>

            <div className="max-w-screen-lg mx-auto mt-8 text-xl font-semibold grid grid-cols-1 space-x-3 text-gray-800">
                New Quiz
            </div>
            <div className="max-w-screen-lg mx-auto my-4 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 px-6 py-6 bg-stone-100 gap-4 rounded-lg">
                <div className="bg-white px-4 py-4 font-medium text-gray-800 h-48 grid place-items-center rounded-md">
                    <div className="w-full text-center text-2xl text-gray-800">
                        Title quiz 1
                        <div className="flex items-center justify-center space-x-1 mt-4">
                            <div className="bg-stone-400 text-white font-medium rounded-full px-2 py-1 text-xs">
                                General
                            </div>
                            <div className="bg-stone-400 text-white font-medium rounded-full px-2 py-1 text-xs">
                                50 Question
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white px-4 py-4 font-medium text-gray-800 h-48 grid place-items-center rounded-md">
                    <div className="w-full text-center text-2xl text-gray-800">
                        Title quiz 2
                        <div className="flex items-center justify-center space-x-1 mt-4">
                            <div className="bg-stone-400 text-white font-medium rounded-full px-2 py-1 text-xs">
                                Math
                            </div>
                            <div className="bg-stone-400 text-white font-medium rounded-full px-2 py-1 text-xs">
                                50 Question
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white px-4 py-4 font-medium text-gray-800 h-48 grid place-items-center rounded-md">
                    <div className="w-full text-center text-2xl text-gray-800">
                        Title quiz 3
                        <div className="flex items-center justify-center space-x-1 mt-4">
                            <div className="bg-stone-400 text-white font-medium rounded-full px-2 py-1 text-xs">
                                Science
                            </div>
                            <div className="bg-stone-400 text-white font-medium rounded-full px-2 py-1 text-xs">
                                50 Question
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white px-4 py-4 font-medium text-gray-800 h-48 grid place-items-center rounded-md">
                    <div className="w-full text-center text-2xl text-gray-800">
                        Title quiz 4
                        <div className="flex items-center justify-center space-x-1 mt-4">
                            <div className="bg-stone-400 text-white font-medium rounded-full px-2 py-1 text-xs">
                                Science
                            </div>
                            <div className="bg-stone-400 text-white font-medium rounded-full px-2 py-1 text-xs">
                                50 Question
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white px-4 py-4 font-medium text-gray-800 h-48 grid place-items-center rounded-md">
                    <div className="w-full text-center text-2xl text-gray-800">
                        Title quiz 5
                        <div className="flex items-center justify-center space-x-1 mt-4">
                            <div className="bg-stone-400 text-white font-medium rounded-full px-2 py-1 text-xs">
                                Science
                            </div>
                            <div className="bg-stone-400 text-white font-medium rounded-full px-2 py-1 text-xs">
                                50 Question
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white px-4 py-4 font-medium text-gray-800 h-48 grid place-items-center rounded-md">
                    <div className="w-full text-center text-2xl text-gray-800">
                        Title quiz 6
                        <div className="flex items-center justify-center space-x-1 mt-4">
                            <div className="bg-stone-400 text-white font-medium rounded-full px-2 py-1 text-xs">
                                Science
                            </div>
                            <div className="bg-stone-400 text-white font-medium rounded-full px-2 py-1 text-xs">
                                50 Question
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* category */}
            <div className="max-w-screen-lg mx-auto mt-8 text-xl font-semibold grid text-gray-800">
                Quiz Categories
            </div>
            <div className="max-w-screen-lg mx-auto my-4 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-3 bg-stone-100 px-4 py-4 rounded-lg">
                <div className="bg-white px-4 py-4 font-medium text-gray-800 h-32 grid place-items-center rounded-md">
                    <div className="w-full text-center text-xl text-gray-800">
                        General
                        <div className="flex items-center justify-center space-x-1 mt-4">
                            <div className="bg-stone-400 text-white font-medium rounded-full px-2 py-1 text-xs">
                                50 Quiz
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white px-4 py-4 font-medium text-gray-800 h-32 grid place-items-center rounded-md">
                    <div className="w-full text-center text-xl text-gray-800">
                        Math
                        <div className="flex items-center justify-center space-x-1 mt-4">
                            <div className="bg-stone-400 text-white font-medium rounded-full px-2 py-1 text-xs">
                                70 Quiz
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white px-4 py-4 font-medium text-gray-800 h-32 grid place-items-center rounded-md">
                    <div className="w-full text-center text-xl text-gray-800">
                        Science
                        <div className="flex items-center justify-center space-x-1 mt-4">
                            <div className="bg-stone-400 text-white font-medium rounded-full px-2 py-1 text-xs">
                                30 quiz
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white px-4 py-4 font-medium text-gray-800 h-32 grid place-items-center rounded-md">
                    <div className="w-full text-center text-xl text-gray-800">
                        Tech
                        <div className="flex items-center justify-center space-x-1 mt-4">
                            <div className="bg-stone-400 text-white font-medium rounded-full px-2 py-1 text-xs">
                                30 quiz
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white px-4 py-4 font-medium text-gray-800 h-32 grid place-items-center rounded-md">
                    <div className="w-full text-center text-xl text-gray-800">
                        Biology
                        <div className="flex items-center justify-center space-x-1 mt-4">
                            <div className="bg-stone-400 text-white font-medium rounded-full px-2 py-1 text-xs">
                                30 quiz
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ParticipantLayout>
    );
}
