import React, { useEffect, useState } from "react";
import useAxios from "../Hooks/useAxios";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Loading";
import Swal from "sweetalert2";
import { getAuth } from "firebase/auth";

const AllUsers = () => {
    const axios = useAxios();
    const { user } = useAuth();

    const [users, setUsers] = useState([]);
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const limit = 10;
    const totalPages = Math.ceil(total / limit);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = await getAuth().currentUser.getIdToken();

            const res = await axios.get("/dashboard/all-users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    status,
                    page,
                    limit,
                },
            });

            setUsers(res.data.users);
            setTotal(res.data.total);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to load users", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [status, page]);

    const handleUpdateUser = async (id, updates) => {
        try {
            const token = await getAuth().currentUser.getIdToken();

            await axios.put(
                `/dashboard/user/${id}`,
                updates,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Swal.fire("Success", "User updated successfully", "success");
            fetchUsers();
        } catch (err) {
            Swal.fire("Error", "Update failed", "error");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10">
            <h1 className="text-3xl font-bold text-red-600 mb-6">
                All Users
            </h1>

            {/* FILTER */}
            <div className="mb-4 flex gap-4">
                <select
                    className="border px-4 py-2 rounded"
                    value={status}
                    onChange={(e) => {
                        setPage(1);
                        setStatus(e.target.value);
                    }}
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                </select>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto border rounded">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-red-100">
                        <tr>
                            <th className="border px-3 py-2">Name</th>
                            <th className="border px-3 py-2">Email</th>
                            <th className="border px-3 py-2">Blood</th>
                            <th className="border px-3 py-2">Role</th>
                            <th className="border px-3 py-2">Status</th>
                            <th className="border px-3 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td className="border px-3 py-2">{u.name}</td>
                                <td className="border px-3 py-2">{u.email}</td>
                                <td className="border px-3 py-2">{u.bloodGroup}</td>
                                <td className="border px-3 py-2 capitalize">{u.role}</td>
                                <td className="border px-3 py-2 capitalize">{u.status}</td>
                                <td className="border px-3 py-2 space-x-2">
                                    {/* ROLE */}
                                    <select
                                        className="border px-2 py-1 rounded text-sm"
                                        value={u.role}
                                        onChange={(e) =>
                                            handleUpdateUser(u._id, { role: e.target.value })
                                        }
                                    >
                                        <option value="donor">Donor</option>
                                        <option value="volunteer">Volunteer</option>
                                        <option value="admin">Admin</option>
                                    </select>

                                    {/* STATUS */}
                                    <select
                                        className="border px-2 py-1 rounded text-sm"
                                        value={u.status}
                                        onChange={(e) =>
                                            handleUpdateUser(u._id, { status: e.target.value })
                                        }
                                    >
                                        <option value="active">Active</option>
                                        <option value="blocked">Blocked</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-3 mt-6">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Prev
                </button>

                <span className="font-semibold">
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AllUsers;
