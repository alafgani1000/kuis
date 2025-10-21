import ParticipantLayout from "@/Layouts/ParticipanLayout";

export default function ParticipantDashboard({ auth, takes }) {
    return (
        <ParticipantLayout auth={auth}>
            <div className="max-w-screen-lg mx-auto my-4 grid grid-cols-1 px-8 py-8 bg-cover gap-6 rounded-lg bg-background">
                <div>
                    <h2 className="text-gray-900 text-2xl font-semibold">
                        List of Completed Quizzes
                    </h2>
                </div>
                <div className="border rounded-lg w-full overflow-auto bg-white">
                    <table className="table-auto w-full">
                        <thead className="bg-gray-100 border-slate-400 text-md">
                            <tr>
                                <th className="py-2 px-2 border">Quiz</th>
                                <th className="py-2 px-2 border">Score</th>
                                <th className="py-2 px-2 border">Started At</th>
                                <th className="py-2 px-2 border">
                                    Finished At
                                </th>
                            </tr>
                        </thead>
                        {takes.map((take, index) => {
                            return (
                                <tr>
                                    <td className="px-2 py-2 border">
                                        {take.quiz.title}
                                    </td>
                                    <td className="px-2 py-2 border text-center">
                                        {take.score}
                                    </td>
                                    <td className="px-2 py-2 border">
                                        {take.started_at}
                                    </td>
                                    <td className="px-2 py-2 border">
                                        {take.finished_at}
                                    </td>
                                </tr>
                            );
                        })}
                    </table>
                </div>
            </div>
        </ParticipantLayout>
    );
}
