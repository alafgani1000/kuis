import { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import Notification from "@/Components/Notification";

export default function Authenticated({ auth, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const { user, role, permission } = auth;
    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* side bar */}
            <div
                className={
                    "md:flex flex-col w-64 h-screen bg-slate-800 sticky top-0 text-white " +
                    (showingNavigationDropdown === false ? "hidden" : "flex")
                }
            >
                <div className="overflow-auto mb-20">
                    <div className="flex w-full justify-between px-6 py-5">
                        {/* <Link className="me-2" href="/">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                            </Link> */}

                        <h2 className="text-3xl">Regrinding </h2>

                        {showingNavigationDropdown === true ? (
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(false)
                                }
                            >
                                <i className="bi bi-arrow-left-square-fill text-2xl"></i>
                            </button>
                        ) : (
                            <></>
                        )}
                    </div>

                    {/* side bar menu */}
                    <div className="mt-2 px-8 text-base">
                        <NavLink
                            className="ms-2"
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                        >
                            <i className="bi bi-easel2 me-2 text-lg"></i>
                            Dashboard
                        </NavLink>
                    </div>
                    <div className="divider px-4 mt-8 text-xs text-gray-400 font-medium bg-slate-900 py-2 mx-6 rounded">
                        <i className="bi bi-app-indicator me-2"></i>Main apps
                    </div>
                    <div className="py-4 px-8 text-base grid space-y-4">
                        <NavLink
                            className="ms-2 block"
                            href={route("role.index")}
                            active={route().current("role.index")}
                        >
                            <i className="bi bi bi-calendar2-week me-4 text-base"></i>
                            Planning
                        </NavLink>

                        <NavLink
                            className="ms-2 block"
                            href={route("role.index")}
                            active={route().current("role.index")}
                        >
                            <i className="bi bi-gear me-4 text-base"></i>
                            Regrinding
                        </NavLink>
                    </div>
                    <div className="divider px-4 mt-6 text-xs text-gray-400 font-medium bg-slate-900 py-2 mx-6 rounded">
                        <i className="bi bi-app me-2"></i>Master data
                    </div>
                    <div className="py-4 px-8 text-base grid space-y-4">
                        <NavLink
                            className="ms-2 block"
                            href={route("role.index")}
                            active={route().current("role.index")}
                        >
                            <i className="bi bi-bookmarks me-4 text-base"></i>
                            Category
                        </NavLink>

                        <NavLink
                            className="ms-2 block"
                            href={route("role.index")}
                            active={route().current("role.index")}
                        >
                            <i className="bi bi-clipboard me-4 text-base"></i>
                            Status
                        </NavLink>
                    </div>

                    <div className="divider px-4 mt-6 text-xs text-gray-400 font-medium bg-slate-900 py-2 mx-6 rounded">
                        <i className="bi bi-gear-wide-connected me-2"></i>
                        Settings
                    </div>
                    <div className="py-4 px-8 text-base grid space-y-4">
                        <NavLink
                            className="ms-2 block"
                            href={route("user.index")}
                            active={route().current("user.index")}
                        >
                            <i className="bi bi-person-gear me-4 text-base"></i>
                            User
                        </NavLink>

                        <NavLink
                            className="ms-2 block"
                            href={route("role.index")}
                            active={route().current("role.index")}
                        >
                            <i className="bi bi-bookmarks me-4 text-base"></i>
                            Role
                        </NavLink>

                        <NavLink
                            className="ms-2 block"
                            href={route("permission.index")}
                            active={route().current("permission.index")}
                        >
                            <i className="bi bi-clipboard me-4 text-base"></i>
                            Permission
                        </NavLink>
                        <NavLink
                            className="ms-2 block"
                            href={route("role-perms.index")}
                            active={route().current("role-perms.index")}
                        >
                            <i className="bi bi-clipboard me-4 text-base"></i>
                            Permission have roles
                        </NavLink>
                    </div>
                </div>
                <div className="absolute bottom-2 my-4 mx-4 px-2 py-2 rounded text-xs font-semibold text-slate-400 bg-slate-950">
                    &copy; Yasunaga Indonesia 2024
                </div>
            </div>

            {/* nav bar */}
            <div className="flex flex-col flex-1">
                <div className="sticky top-0 z-50">
                    <nav className="bg-white border-b border-gray-100 flex py-4 pe-8">
                        <div className="md:hidden px-5">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(true)
                                }
                            >
                                <i className="bi bi-list text-2xl"></i>
                            </button>
                        </div>
                        <div className="flex ms-4 md:ms-8 items-center">
                            <Link
                                className="flex me-2 font-medium py-1 px-2 rounded text-sm bg-blue-500 text-gray-100"
                                href={route("role.index")}
                            >
                                <i className="bi bi-book me-2"></i>Panduan
                            </Link>
                        </div>
                        <div className="flex sm:ms-6 w-full justify-end">
                            <div className="ms-3 relative">
                                <Notification>
                                    <Notification.Trigger>
                                        <span className=" rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-1.5 py-1.5 border text-sm leading-4 font-medium rounded-full bg-gray-200 hover:text-blue-500 focus:outline-none transition ease-in-out duration-150 text-blue-600"
                                            >
                                                <i className="bi bi-bell-fill"></i>
                                            </button>
                                        </span>
                                    </Notification.Trigger>
                                    <Notification.Content>
                                        <Notification.Item>
                                            Status
                                        </Notification.Item>
                                    </Notification.Content>
                                </Notification>
                            </div>
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </nav>

                    {header && (
                        <header className="bg-white shadow">
                            <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}
                </div>

                <main className="overflow-auto">{children}</main>
            </div>

            {/* <div className="max-w-screen-2xl mx-auto px-0 md:px-6 lg:px-8 space-y-6">
                <div className="bg-white overflow-hidden shadow-sm lg:rounded md:rounded py-4 px-4">
                    <div className="text-gray-400">
                        &copy; 2024 Yasunaga Indonesia
                        <br />
                    </div>
                </div>
            </div> */}
        </div>
    );
}
