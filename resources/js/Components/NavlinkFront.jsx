import { Link } from "@inertiajs/react";

export default function NavLinkFront({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                "inline-flex items-center hover:text-gray-200 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none " +
                (active
                    ? "text-white font-semibold focus:text-gray-200"
                    : "text-white hover:text-gray-900 focus:text-gray-200") +
                className
            }
        >
            {children}
        </Link>
    );
}
