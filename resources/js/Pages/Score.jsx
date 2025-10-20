import ParticipantLayout from "@/Layouts/ParticipanLayout";
import { useEffect } from "react";

export default function Score({ auth, take }) {
    /**
     * delete local storage data
     *
     */
    const deleteLocalStorageData = () => {
        localStorage.removeItem("quiz" + take.quiz_id);
        localStorage.removeItem("quiz" + take.quiz_id + "_index");
        localStorage.removeItem("quiz" + take.quiz_id + "_skip");
        localStorage.removeItem("quiz" + take.quiz_id + "_current");
        localStorage.removeItem("quiz" + take.quiz_id + "_count_choosed");
        localStorage.removeItem("quizLastTimeChoice" + take.quiz_id);
        localStorage.removeItem("quizStartTime" + take.quiz_id);
    };

    useEffect(() => {
        deleteLocalStorageData();
    }, []);

    return (
        <ParticipantLayout auth={auth}>
            <div className="max-w-screen-lg mx-auto mt-10 mb-4 text-xl font-semibold grid grid-cols-1 space-x-3 text-gray-700 py-4 px-4">
                <div className="mx-auto py-4 px-4">
                    <h2 className="text-gray-900">Quiz Result</h2>
                    <h4>Congrulations, you have finished the quiz.</h4>
                    <div className="text-center mt-8 px-4 py-4 bg-emerald-600 rounded text-white">
                        <div className="pb-4">
                            Your Score
                            <br />
                            <br />
                            <span className="text-black text-4xl bg-white py-4 px-4 rounded-xl">
                                {take?.score}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </ParticipantLayout>
    );
}
