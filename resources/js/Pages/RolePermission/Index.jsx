import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import parse from "html-react-parser";
import Modal from "@/Components/Modal";
import axios from "axios";

export default function Index({
    auth,
    roles,
    pgSearch,
    pgSort,
    pgPerPage,
    permissions,
}) {
    const [search, setSearch] = useState(pgSearch || "");
    const [sort, setSort] = useState(pgSort || "");
    const [perPage, setPerPage] = useState(pgPerPage || 10);
    const [wasSearch, setWasSearch] = useState(false);
    const [modalCreate, setModalCreate] = useState(false);
    const [modalConfirmDelete, setModalConfirmDelete] = useState(false);
    const [permissionName, setPermissionName] = useState("");
    const [idDelete, setIdDelete] = useState("");
    const [formTitle, setFormTitle] = useState("Assigning Permissions to");
    const [roleSelected, setRoleSelected] = useState({});
    const [permissionSelected, setPermissionSelected] = useState({});

    const handleSearch = () => {
        // handle search
        if (wasSearch) {
            router.get(
                route(route().current()),
                { search: search, sort: sort, perPage: perPage },
                {
                    replace: true,
                    preserveState: true,
                }
            );
        }
    };

    const handleRefresh = () => {
        // handle search
        router.get(
            route(route().current()),
            { search: search, sort: sort, perPage: perPage },
            {
                replace: true,
                preserveState: true,
            }
        );
    };

    const dataPermisson = () => {
        axios
            .get(`/admin/role-permission/${roleSelected.id}/data`)
            .then((res) => {
                setRoleSelected(res.data);
            })
            .catch((res) => {
                console.log(res.data);
            });
    };

    const assigningPermission = (data) => {
        setRoleSelected(data);
        setModalCreate(true);
    };

    useEffect(() => {
        handleSearch();
    }, [search, sort, perPage]);

    const closeModal = () => {
        setModalCreate(false);
        setPermissionName("");
        setRoleSelected({});
        handleRefresh();
    };

    const closeModalDelete = () => {
        setModalConfirmDelete(false);
        setPermissionSelected({});
        setIdDelete("");
    };

    const confirmDeletePermission = (data) => {
        setPermissionSelected(data);
        setModalConfirmDelete(true);
    };

    const detachPermission = () => {
        axios
            .post(`/admin/role-permission-revoke`, {
                roleName: roleSelected.name,
                permissionName: permissionSelected.name,
            })
            .then((res) => {
                closeModalDelete();
                dataPermisson();
            })
            .catch((res) => {
                console.log(res.data);
            });
    };

    const saveRole = (e) => {
        e.preventDefault();
        axios
            .post("/admin/role-permission", {
                roleName: roleSelected.name,
                permissionName: permissionName,
            })
            .then((res) => {
                dataPermisson();
            })
            .catch((error) => {
                console.log(error.response.data);
            });
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Role Have Permission
                </h2>
            }
        >
            <Head title="Role" />

            <div className="py-4 lg:py-12 md:py-12">
                <div className="max-w-full mx-auto space-y-6">
                    <div className="bg-white rounded-md shadow">
                        <div className="text-gray-900 relative overflow-x-auto">
                            <div className="bg-white py-3 px-6 mt-0 mb-4 text-gray-800 font-bold border-b border-zinc rounded-t-md text-lg">
                                Assigning Permissions to Roles
                            </div>
                            {/* <div className="flex justify-end mr-8"></div> */}
                            <div className="lg:mx-8 md:mx-8 mx-0 my-8 border border-zinc-100 md:rounded-lg lg:rounded-lg">
                                <div className="grid bg-zinc-100 py-4 px-4 border-b border-zinc-200 items-center">
                                    <div className="lg:flex lg:space-x-4 justify-start">
                                        <div className="flex items-center space-x-2 bg-white rounded-md ps-3 md:mb-2 mb-2">
                                            <span className="text-base text-slate-400">
                                                <i className="bi bi-book-half"></i>
                                            </span>
                                            <select
                                                value={perPage}
                                                onChange={(e) => {
                                                    setPerPage(e.target.value);
                                                    setWasSearch(true);
                                                }}
                                                className="py-2 bg-white border-none focus:outline-none focus:border-white focus:ring-white block rounded-md text-base focus:ring-0 text-gray-500 w-full"
                                            >
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-white rounded-md ps-3 md:mb-2 mb-2">
                                            <span className="text-base text-slate-500">
                                                <i className="bi bi-sort-down-alt"></i>
                                            </span>
                                            <select
                                                value={sort}
                                                onChange={(e) => {
                                                    setSort(e.target.value);
                                                    setWasSearch(true);
                                                }}
                                                className="py-2 bg-white border-none focus:outline-none focus:border-white focus:ring-white block rounded-md text-base focus:ring-0 text-gray-500 w-full"
                                            >
                                                <option value="name">
                                                    Name
                                                </option>
                                            </select>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-white rounded-md ps-3 md:mb-2 mb-2">
                                            <span className="text-sm text-slate-400">
                                                <i className="bi bi-search"></i>
                                            </span>
                                            <input
                                                value={search}
                                                type="text"
                                                className="bg-white shadow-sm border-none placeholder-slate-400 rounded-md focus:outline-none focus:ring-0 block sm:text-base text-gray-500 w-full"
                                                placeholder="Search"
                                                onChange={(e) => {
                                                    setSearch(e.target.value);
                                                    setWasSearch(true);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <table className="text-sm md:text-base w-full table-auto me-4">
                                    <thead className="bg-zinc-100 p-2">
                                        <tr className="p-8">
                                            <th className="text-left py-4 px-4">
                                                Role
                                            </th>
                                            <th className="text-left py-4 px-4">
                                                Permmission
                                            </th>
                                            <th className="text-left py-4 px-4">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roles.data.map((role, index) => {
                                            return (
                                                <tr
                                                    className="border-t last:border-b"
                                                    key={index}
                                                >
                                                    <td className="text-left py-3 px-4">
                                                        {role.name}
                                                    </td>
                                                    <td className="text-left py-3 px-4">
                                                        <div className="flex flex-wrap space-x-1">
                                                            {role.permissions.map(
                                                                (
                                                                    value,
                                                                    index
                                                                ) => {
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="bg-rose-500 text-white px-2 py-1 my-1 rounded-full text-xs font-bold"
                                                                        >
                                                                            {
                                                                                value.name
                                                                            }
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="content-center">
                                                        <div className="flex flex-wrap space-x-1">
                                                            <button
                                                                onClick={() => {
                                                                    assigningPermission(
                                                                        role
                                                                    );
                                                                }}
                                                                className="bg-slate-500 px-3 py-2 text-white text-sm rounded hover:bg-blue-600"
                                                            >
                                                                <i className="bi bi-gear-wide-connected"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {/* pagination */}
                                <div className="hidden mt-4 mb-4 w-full md:block md:w-auto">
                                    <ul className="flex justify-center items-center -space-x-px text-base h-10">
                                        {roles.links.map((link, index) => {
                                            return (
                                                <li
                                                    key={index}
                                                    className="first:rounded-l-md border last:rounded-e-md"
                                                >
                                                    {link.active === false ? (
                                                        link.url === null ? (
                                                            <Link
                                                                href={null}
                                                                className="flex items-center justify-center px-2 py-1 text-sm lg:text-base md:px-3 md:py-2"
                                                                disabled
                                                            >
                                                                {parse(
                                                                    link.label
                                                                )}
                                                            </Link>
                                                        ) : (
                                                            <Link
                                                                href={`${link.url}&search=${search}&perPage=${perPage}`}
                                                                className="flex items-center justify-center px-2 py-1 text-sm lg:text-base md:px-3 md:py-2"
                                                                disabled
                                                            >
                                                                {parse(
                                                                    link.label
                                                                )}
                                                            </Link>
                                                        )
                                                    ) : (
                                                        <Link
                                                            href={null}
                                                            className="flex items-center justify-center px-2 py-1 lg:text-base bg-slate-100 text-sm md:px-3 md:py-2"
                                                        >
                                                            {`${parse(
                                                                link.label
                                                            )}`}
                                                        </Link>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <div className="md:hidden lg:hidden">
                                    <div className="grid grid-cols-2 text-sm md:grid-cols-2 lg:grid-cols-2 md:text-base lg:text-base space-x-4 my-4 mx-8">
                                        <div className="flex justify-start text-zinc-600 ">
                                            <span className="py-2 px-2 bg-zinc-100 rounded">
                                                Page {roles.current_page}
                                                &nbsp; from {
                                                    roles.last_page
                                                }{" "}
                                            </span>{" "}
                                        </div>
                                        <div className="flex justify-start space-x-4">
                                            <Link
                                                href={`${roles.prev_page_url}&search=${search}&perPage=${perPage}`}
                                                className="border py-2 px-4 rounded-md hover:bg-sky-500 hover:border-sky-500 hover:text-white"
                                            >
                                                Prev
                                            </Link>
                                            <Link
                                                href={`${roles.next_page_url}&search=${search}&perPage=${perPage}`}
                                                className="border py-2 px-4 rounded-md hover:bg-sky-500 hover:border-sky-500 hover:text-white"
                                            >
                                                Next
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={modalCreate}>
                <div className="bg-white rounded max-w-3xl w-full mx-auto">
                    <div className="flex flex-col items-end m-0 p-0">
                        <button
                            onClick={() => closeModal()}
                            className="bg-zinc-700 px-3 py-1 text-white hover:bg-rose-600 rounded-tr"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <form onSubmit={saveRole} className="px-6 pb-6">
                        <h2 className="text-lg font-medium text-gray-900">
                            {formTitle} {roleSelected.name}
                        </h2>
                        <div className="grid mt-4">
                            <label className="mb-2">Permission Name</label>
                            <select
                                value={permissionName}
                                onChange={(e) => {
                                    setPermissionName(e.target.value);
                                }}
                                className="rounded focus:ring-sky-500 focus:border-sky-500"
                            >
                                <option>-- Please Select Role --</option>
                                {permissions.map((value, index) => {
                                    return (
                                        <option key={index} value={value.name}>
                                            {value.name}
                                        </option>
                                    );
                                })}
                            </select>
                            <div className="grid justify-end mt-4">
                                <button
                                    type="submit"
                                    className="border border-sky-500 py-2 px-4 rounded-md text-sm bg-sky-500 text-white hover:bg-sky-600"
                                >
                                    Set
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="px-6 pb-6">
                        <table className="text-sm md:text-base w-full table-auto">
                            <thead className="bg-zinc-100 p-2 border border-zinc-100">
                                <tr className="p-8">
                                    <th className="text-left py-4 px-4">
                                        Permission
                                    </th>
                                    <th className="text-left py-4 px-4">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {roleSelected.permissions?.map(
                                    (value, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-t border-b border-zinc-100"
                                            >
                                                <td className="px-4 py-2">
                                                    {value.name}
                                                </td>
                                                <td className="px-4">
                                                    <button
                                                        onClick={() => {
                                                            confirmDeletePermission(
                                                                value
                                                            );
                                                        }}
                                                        className="bg-rose-500 px-3 py-1 text-sm text-white font-bold rounded hover:bg-rose-600"
                                                    >
                                                        X
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>

            <Modal show={modalConfirmDelete}>
                <div className="bg-white rounded max-w-lg mx-auto">
                    <div className="flex flex-col items-end m-0 p-0">
                        <button
                            onClick={() => closeModalDelete()}
                            className="bg-zinc-700 px-3 py-1 text-white hover:bg-rose-600 rounded-tr"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <form className="px-6 pb-6">
                        <div className="mt-4">
                            <h2 className="text-lg font-medium text-gray-900">
                                Are you sure you want to remove{" "}
                                {roleSelected.name} permission?
                            </h2>

                            <p className="mt-1 text-sm text-gray-600">
                                Data will be permanently deleted.
                            </p>
                            <div className="grid justify-end mt-4">
                                <button
                                    onClick={() => detachPermission()}
                                    type="submit"
                                    className="border border-rose-500 py-2 px-4 rounded text-sm bg-rose-500 text-white hover:bg-rose-600 font-bold"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
