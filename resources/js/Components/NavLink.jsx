import { Link } from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                "inline-flex items-center hover:text-gray-600 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none " +
                (active
                    ? "text-gray-500 font-semibold focus:text-gray-500"
                    : "text-whtie hover:text-gray-500 focus:text-gray-500") +
                className
            }
        >
            {children}
        </Link>
    );
}
