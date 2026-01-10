import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
    Eye,
    Edit3,
    Trash2,
    CheckCircle,
    XCircle,
    Search as SearchIcon
} from "lucide-react";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";
import useAxios from "../Hooks/useAxios";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Loading";

const LIMIT = 10;

const MyAllDonationRequests = () => {
    const axios = useAxios();
    const { user } = useAuth();

    // Ensure we are on top after redirected to this page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [requests, setRequests] = useState([]);
    const [allRequests, setAllRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [status, setStatus] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const [districts, setDistricts] = useState([]);
    const [upzillas, setUpzillas] = useState([]);

    const totalPages = Math.ceil(total / LIMIT);

    /* Load Location Data */
    useEffect(() => {
        Promise.all([
            fetch("/districts.json").then(res => res.json()),
            fetch("/upzillas.json").then(res => res.json())
        ]).then(([d, u]) => {
            setDistricts(d);
            setUpzillas(u);
        });
    }, []);

    const decodeLocation = (districtId, upazilaId) => {
        const district = districts.find(d => `${d.id}` === `${districtId}`);
        const upazila = upzillas.find(u => `${u.id}` === `${upazilaId}`);
        return {
            districtName: district?.name || districtId,
            upazilaName: upazila?.name || upazilaId
        };
    };

    /* Fetch Donation Requests */
    useEffect(() => {
        const fetchRequests = async () => {
            if (!user || !districts.length || !upzillas.length) return;

            const startTime = Date.now();
            setLoading(true);
            try {
                const token = await getAuth().currentUser.getIdToken();
                const res = await axios.get(
                    `/dashboard/my-donation-requests?status=${status}&page=${page}&limit=${LIMIT}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const decoded = res.data.requests.map(req => {
                    const { districtName, upazilaName } = decodeLocation(
                        req.recipientDistrict,
                        req.recipientUpazila
                    );
                    return {
                        ...req,
                        recipientDistrictName: districtName,
                        recipientUpazilaName: upazilaName
                    };
                });

                setAllRequests(decoded);
                setFilteredRequests(decoded);
                setRequests(decoded);
                setTotal(res.data.total);
            } catch (err) {
                console.error("Failed to fetch donation requests:", err);
            } finally {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, 400 - elapsedTime);
                setTimeout(() => {
                    setLoading(false);
                }, remainingTime);
            }
        };

        fetchRequests();
    }, [user, status, page, districts, upzillas, axios]);

    // Filter requests based on search query
    useEffect(() => {
        if (!allRequests.length) {
            setFilteredRequests([]);
            setRequests([]);
            return;
        }

        let filtered = [...allRequests];

        // Search filter (recipient name, blood group, location)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((req) => {
                const recipientName = (req.recipientName || "").toLowerCase();
                const bloodGroup = (req.bloodGroup || "").toLowerCase();
                const location = `${req.recipientUpazilaName || ""} ${req.recipientDistrictName || ""}`.toLowerCase();
                
                return (
                    recipientName.includes(query) ||
                    bloodGroup.includes(query) ||
                    location.includes(query)
                );
            });
        }

        setFilteredRequests(filtered);
        setRequests(filtered);
    }, [searchQuery, allRequests]);

    /* Status Update */
    const handleStatusUpdate = async (id, newStatus) => {
        const confirm = await Swal.fire({
            title: "Update Status?",
            text: `Mark this request as ${newStatus}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: newStatus === "done" ? "#16a34a" : "#dc2626",
            confirmButtonText: "Yes, Update"
        });
        if (!confirm.isConfirmed) return;

        try {
            const token = await getAuth().currentUser.getIdToken();
            await axios.put(
                `/dashboard/my-donation-request/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Swal.fire("Success", `Request marked as ${newStatus}`, "success");
            setRequests(prev =>
                prev.map(r =>
                    r._id === id ? { ...r, status: newStatus } : r
                )
            );
        } catch {
            Swal.fire("Error", "Status update failed", "error");
        }
    };

    /* Delete Request */
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Delete this request?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });
        if (!confirm.isConfirmed) return;

        try {
            const token = await getAuth().currentUser.getIdToken();
            await axios.delete(`/dashboard/donation-request/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            Swal.fire("Deleted!", "Request has been removed.", "success");
            setRequests((prev) => prev.filter(r => r._id !== id));
            setTotal(prev => prev - 1);

        } catch {
            Swal.fire("Error", "Delete failed", "error");
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">
        <Loading />
    </div>;

    const statusStyle = (s) =>
    ({
        pending: "bg-orange-100 text-orange-700 border-orange-200",
        inprogress: "bg-yellow-100 text-yellow-700 border-yellow-200",
        done: "bg-green-100 text-green-700 border-green-200",
        canceled: "bg-red-100 text-red-700 border-red-200"
    }[s] || "bg-gray-100 text-gray-700");

    return (
        <div className="p-6 md:p-10 min-h-screen bg-transparent">
            <h1 className="text-4xl font-black text-slate-800 mb-6">
                My Donation Requests 🩸📄
            </h1>

            {/* Search and Filter Bar */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search Bar - Left */}
                <div className="w-full md:flex-1" style={{ maxWidth: '538px' }}>
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by recipient, blood group, or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                        <option value="pending">Pending</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                        <option value="canceled">Canceled</option>
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
                {filteredRequests.length > 0 ? (
                    (() => {
                        const startIdx = (page - 1) * LIMIT + 1;
                        const endIdx = Math.min(page * LIMIT, filteredRequests.length);
                        return `Showing ${startIdx} to ${endIdx} of ${filteredRequests.length} requests`;
                    })()
                ) : (
                    'No requests found'
                )}
            </div>

            {/* Table */}
            {requests.length > 0 ? (
                <div className="overflow-x-auto w-full border border-gray-200 rounded-md shadow-sm bg-white">
                    <table className="w-full border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-gray-50 text-center">
                                {["Recipient", "Location", "Blood", "Date", "Time", "Status", "Actions"].map(h => (
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
                            {requests.map(r => (
                                <tr key={r._id} className="hover:bg-gray-50 transition-colors text-center">
                                    <td className="px-4 py-3 border border-gray-200 text-sm font-medium">{r.recipientName}</td>
                                    <td className="px-4 py-3 border border-gray-200 text-sm">
                                        {r.recipientUpazilaName}, {r.recipientDistrictName}
                                    </td>
                                    <td className="px-4 py-3 border border-gray-200 font-black text-red-600 text-sm">{r.bloodGroup}</td>
                                    <td className="px-4 py-3 border border-gray-200 text-sm">{r.donationDate}</td>
                                    <td className="px-4 py-3 border border-gray-200 text-sm">{r.donationTime}</td>
                                    <td className="px-4 py-3 border border-gray-200">
                                        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold border inline-block ${statusStyle(r.status)}`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 border border-gray-200">
                                        <div className="flex items-center justify-center gap-1">
                                            <Link to={`/dashboard/donation-request/${r._id}`} className="p-1.5 border border-gray-200 rounded-sm hover:bg-gray-100"><Eye size={14} /></Link>
                                            <Link to={`/dashboard/edit-donation-request/${r._id}`} className="p-1.5 border border-gray-200 rounded-sm hover:bg-gray-100 text-blue-600"><Edit3 size={14} /></Link>
                                            <button onClick={() => handleDelete(r._id)} className="p-1.5 border border-gray-200 rounded-sm hover:bg-gray-100 text-red-600"><Trash2 size={14} /></button>

                                            {r.status === "inprogress" && (
                                                <div className="flex gap-1 ml-1 border-l pl-1 border-gray-200">
                                                    <button onClick={() => handleStatusUpdate(r._id, "done")} className="p-1.5 bg-green-600 text-white rounded-sm hover:bg-green-700"><CheckCircle size={14} /></button>
                                                    <button onClick={() => handleStatusUpdate(r._id, "canceled")} className="p-1.5 bg-red-600 text-white rounded-sm hover:bg-red-700"><XCircle size={14} /></button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-12 text-center bg-white/30 rounded-lg border-dashed border-2 border-gray-300">
                    No donation requests found.
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
                    {[...Array(totalPages).keys()].map(num => (
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

export default MyAllDonationRequests;
