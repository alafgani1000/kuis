import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function Guest({ children, className = "" }) {
    return (
        <div className="flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-white">
            <div>
                <Link href="/">
                    {/* <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" /> */}
                </Link>
            </div>

            <div
                className={"w-full overflow-hidden sm:rounded-lg " + className}
            >
                {children}
            </div>
        </div>
    );
}
