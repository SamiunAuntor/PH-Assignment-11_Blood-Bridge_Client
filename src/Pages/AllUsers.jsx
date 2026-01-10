import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";
import useAxios from "../Hooks/useAxios";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Loading";
import { Search as SearchIcon } from "lucide-react";

const LIMIT = 10;

const AllUsers = () => {
    const axios = useAxios();
    const { user } = useAuth();

    // Ensure we are on top after redirected to this page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [status, setStatus] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const totalPages = Math.ceil(total / LIMIT);

    const fetchUsers = async () => {
        const startTime = Date.now();
        setLoading(true);
        try {
            const token = await getAuth().currentUser.getIdToken();
            const res = await axios.get("/dashboard/all-users", {
                headers: { Authorization: `Bearer ${token}` },
                params: { status, page, limit: LIMIT },
            });
            setAllUsers(res.data.users);
            setUsers(res.data.users);
            setTotal(res.data.total);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to load users", "error");
        } finally {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, 400 - elapsedTime);
            setTimeout(() => {
                setLoading(false);
            }, remainingTime);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [status, page]);

    // Filter users based on search query
    useEffect(() => {
        if (!allUsers.length) {
            setUsers([]);
            return;
        }

        let filtered = [...allUsers];

        // Search filter (name, email, blood group, role)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((user) => {
                const name = (user.name || "").toLowerCase();
                const email = (user.email || "").toLowerCase();
                const bloodGroup = (user.bloodGroup || "").toLowerCase();
                const role = (user.role || "").toLowerCase();
                
                return (
                    name.includes(query) ||
                    email.includes(query) ||
                    bloodGroup.includes(query) ||
                    role.includes(query)
                );
            });
        }

        setUsers(filtered);
    }, [searchQuery, allUsers]);

    // Handle role/status update with confirmation
    const handleUpdateUser = async (id, updates) => {
        const key = Object.keys(updates)[0]; // role or status
        const value = updates[key];

        const confirm = await Swal.fire({
            title: `Are you sure?`,
            text: `Change ${key} to "${value}"?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!",
        });

        if (!confirm.isConfirmed) return;

        try {
            const token = await getAuth().currentUser.getIdToken();
            await axios.put(`/dashboard/user/${id}`, updates, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Success", `${key} updated successfully`, "success");
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
        <div className="p-6 md:p-10 min-h-screen bg-transparent">
            <h1 className="text-4xl font-black text-slate-800 mb-6">
                All Users 👥🧑‍🤝‍🧑
            </h1>

            {/* Search and Filter Bar */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search Bar - Left */}
                <div className="w-full md:flex-1" style={{ maxWidth: '538px' }}>
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email, blood group, or role..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(1); // Reset to page 1 when search changes
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-700"
                        />
                    </div>
                </div>

                {/* Filter - Right */}
                <div className="relative w-full md:w-48">
                    <select
                        className="border border-gray-300 px-3 py-2 rounded shadow-sm font-semibold w-full appearance-none"
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                    </select>
                    {/* Down arrow icon */}
                    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                        <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Count Display */}
            <div className="mb-4 text-lg font-bold text-gray-700">
                {(() => {
                    // If search query exists, use filtered results (client-side filtering)
                    // Otherwise, use total from server (all matching items across pages)
                    const displayTotal = searchQuery.trim() ? users.length : total;
                    const displayUsers = users;
                    
                    if (displayUsers.length > 0) {
                        const startIdx = searchQuery.trim() 
                            ? 1 
                            : (page - 1) * LIMIT + 1;
                        const endIdx = searchQuery.trim()
                            ? users.length
                            : Math.min(page * LIMIT, total);
                        return `Showing ${startIdx} to ${endIdx} of ${displayTotal} users`;
                    } else {
                        return 'No users found';
                    }
                })()}
            </div>

            {/* Table */}
            {users.length > 0 ? (
                <div className="overflow-x-auto w-full border border-gray-200 rounded-md shadow-sm bg-white">
                    <table className="w-full border-collapse min-w-[700px] text-center">
                        <thead>
                            <tr className="bg-gray-50">
                                {["Avatar", "Name", "Email", "Blood", "Role", "Status"].map((h) => (
                                    <th
                                        key={h}
                                        className="px-4 py-3 border border-gray-200 font-bold text-xs uppercase text-slate-700"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                                    {/* Avatar column */}
                                    <td className="px-4 py-3 border border-gray-200">
                                        <img
                                            src={u.avatar || "/default-avatar.png"}
                                            alt={u.name}
                                            className="w-10 h-10 rounded-full object-cover mx-auto"
                                        />
                                    </td>

                                    {/* Static columns */}
                                    <td className="px-4 py-3 border border-gray-200 text-sm font-medium">{u.name}</td>
                                    <td className="px-4 py-3 border border-gray-200 text-sm">{u.email}</td>

                                    {/* Last 3 columns */}
                                    <td className="px-4 py-3 border border-gray-200 font-black text-red-600 text-sm">{u.bloodGroup}</td>

                                    <td className="px-4 py-3 border border-gray-200 text-sm">
                                        <select
                                            className="border border-gray-300 px-2 py-1 rounded font-semibold w-full"
                                            value={u.role}
                                            onChange={(e) => handleUpdateUser(u._id, { role: e.target.value })}
                                        >
                                            <option value="donor">Donor</option>
                                            <option value="volunteer">Volunteer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>

                                    <td className="px-4 py-3 border border-gray-200 text-sm">
                                        <select
                                            className="border border-gray-300 px-2 py-1 rounded font-semibold w-full"
                                            value={u.status}
                                            onChange={(e) => handleUpdateUser(u._id, { status: e.target.value })}
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
            ) : (
                <div className="p-12 text-center bg-white/30 rounded-lg border-dashed border-2 border-gray-300">
                    No users found.
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    {[...Array(totalPages).keys()].map((num) => (
                        <button
                            key={num}
                            onClick={() => setPage(num + 1)}
                            className={`px-3 py-1 border rounded ${page === num + 1 ? "bg-red-600 text-white" : ""}`}
                        >
                            {num + 1}
                        </button>
                    ))}
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllUsers;
