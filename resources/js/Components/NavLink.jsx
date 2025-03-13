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
                "inline-flex items-center hover:text-gray-400 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none " +
                (active
                    ? "text-gray-400 font-semibold focus:text-gray-400"
                    : "text-whtie hover:text-gray-400 focus:text-gray-400") +
                className
            }
        >
            {children}
        </Link>
    );
}
