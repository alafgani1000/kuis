import { Link, Head } from "@inertiajs/react";
import ParticipantLayout from "@/Layouts/ParticipanLayout";

export default function Welcome({
    auth,
    canLogin,
    laravelVersion,
    phpVersion,
}) {
    return (
        <ParticipantLayout
            auth={auth}
            header={<h2 className="leading-tight font-bold">Welcome</h2>}
        ></ParticipantLayout>
    );
}
