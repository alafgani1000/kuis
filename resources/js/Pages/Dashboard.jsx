import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard({ auth, stats }) {
    const statCards = [
        {
            title: "Total Courses",
            value: stats?.total_courses || 0,
            icon: <i className="bi bi-book text-3xl text-blue-500"></i>,
            bgColor: "bg-blue-100",
        },
        {
            title: "Total Quizzes",
            value: stats?.total_quizzes || 0,
            icon: <i className="bi bi-question-circle text-3xl text-green-500"></i>,
            bgColor: "bg-green-100",
        },
        {
            title: "Total Users",
            value: stats?.total_users || 0,
            icon: <i className="bi bi-people text-3xl text-purple-500"></i>,
            bgColor: "bg-purple-100",
        },
        {
            title: "Total Participants",
            value: stats?.total_participants || 0,
            icon: <i className="bi bi-person-check text-3xl text-orange-500"></i>,
            bgColor: "bg-orange-100",
        },
    ];

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {statCards.map((card, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                                    <div className={`p-3 rounded-full ${card.bgColor} mr-4`}>
                                        {card.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                        <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
