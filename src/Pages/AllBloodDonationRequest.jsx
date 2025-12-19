import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxios from "../Hooks/useAxios";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";
import Loading from "../Components/Loading";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";
import { Eye, Edit3, Trash2, CheckCircle, XCircle } from "lucide-react";

const LIMIT = 10;

const AllBloodDonationRequest = () => {
    const axios = useAxios();
    const { user } = useAuth();
    const { role } = useRole();

    const [requests, setRequests] = useState([]);
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const [districts, setDistricts] = useState([]);
    const [upzillas, setUpzillas] = useState([]);

    const totalPages = Math.ceil(total / LIMIT);

    /* Fetch location JSON */
    useEffect(() => {
        const loadLocations = async () => {
            const [districtRes, upzillaRes] = await Promise.all([
                fetch("/districts.json").then(res => res.json()),
                fetch("/upzillas.json").then(res => res.json()),
            ]);
            setDistricts(districtRes);
            setUpzillas(upzillaRes);
        };
        loadLocations();
    }, []);

    const decodeLocation = (districtId, upazilaId) => {
        const district = districts.find(d => String(d.id) === String(districtId));
        const upazila = upzillas.find(u => String(u.id) === String(upazilaId));

        return {
            districtName: district?.name || districtId,
            upazilaName: upazila?.name || upazilaId,
        };
    };

    /* Fetch donation requests */
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);

                const auth = getAuth();
                const token = await auth.currentUser.getIdToken();

                const res = await axios.get(
                    `/dashboard/all-blood-donation-request?status=${status}&page=${page}&limit=${LIMIT}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const decoded = res.data.requests.map(req => {
                    const { districtName, upazilaName } = decodeLocation(
                        req.recipientDistrict,
                        req.recipientUpazila
                    );
                    return {
                        ...req,
                        recipientDistrictName: districtName,
                        recipientUpazilaName: upazilaName,
                    };
                });

                setRequests(decoded);
                setTotal(res.data.total);
            } catch (err) {
                console.error("Failed to fetch donation requests:", err);
                Swal.fire("Error", "Failed to load donation requests", "error");
            } finally {
                setLoading(false);
            }
        };

        if (user && districts.length && upzillas.length) {
            fetchRequests();
        }
    }, [user, status, page, districts, upzillas, axios]);

    /* Update Status (Admin & Volunteer)*/
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();

            await axios.put(
                `/dashboard/donation-request/${id}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Swal.fire("Success", `Status updated to ${newStatus}`, "success");

            // Refresh the list
            const res = await axios.get(
                `/dashboard/all-blood-donation-request?status=${status}&page=${page}&limit=${LIMIT}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const decoded = res.data.requests.map(req => {
                const { districtName, upazilaName } = decodeLocation(
                    req.recipientDistrict,
                    req.recipientUpazila
                );
                return {
                    ...req,
                    recipientDistrictName: districtName,
                    recipientUpazilaName: upazilaName,
                };
            });

            setRequests(decoded);
            setTotal(res.data.total);
        } catch (err) {
            console.error("Failed to update status:", err);
            Swal.fire("Error", "Failed to update status", "error");
        }
    };

    /* Delete Request (Admin only) */
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                const auth = getAuth();
                const token = await auth.currentUser.getIdToken();
                await axios.delete(`/dashboard/donation-request/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                Swal.fire("Deleted!", "The request has been deleted.", "success");
                // Refresh list
                const res = await axios.get(
                    `/dashboard/all-blood-donation-request?status=${status}&page=${page}&limit=${LIMIT}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const decoded = res.data.requests.map(req => {
                    const { districtName, upazilaName } = decodeLocation(
                        req.recipientDistrict,
                        req.recipientUpazila
                    );
                    return {
                        ...req,
                        recipientDistrictName: districtName,
                        recipientUpazilaName: upazilaName,
                    };
                });
                setRequests(decoded);
                setTotal(res.data.total);
            } catch (err) {
                Swal.fire("Error", "Delete failed", "error");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loading />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold text-red-600">
                All Blood Donation Requests 🩸
            </h1>

            {/* Filter*/}
            <div>
                <select
                    className="border px-3 py-2 rounded"
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
            </div>

            {/* Table */}
            <div className="overflow-x-auto -mx-6 md:mx-0">
                <div className="inline-block min-w-full align-middle px-6 md:px-0">
                    <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-red-100">
                        <tr>
                            <th className="border px-3 py-2">Recipient Name</th>
                            <th className="border px-3 py-2">Requester</th>
                            <th className="border px-3 py-2">Location</th>
                            <th className="border px-3 py-2">Blood Group</th>
                            <th className="border px-3 py-2">Date</th>
                            <th className="border px-3 py-2">Time</th>
                            <th className="border px-3 py-2">Status</th>
                            <th className="border px-3 py-2">Donor Info</th>
                            {role === "volunteer" && (
                                <th className="border px-3 py-2">Update Status</th>
                            )}
                            {role === "admin" && (
                                <th className="border px-3 py-2">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req._id} className="text-center">
                                <td className="border px-3 py-2">{req.recipientName}</td>
                                <td className="border px-3 py-2">{req.requesterName}</td>
                                <td className="border px-3 py-2">
                                    {req.recipientUpazilaName}, {req.recipientDistrictName}
                                </td>
                                <td className="border px-3 py-2">{req.bloodGroup}</td>
                                <td className="border px-3 py-2">{req.donationDate}</td>
                                <td className="border px-3 py-2">{req.donationTime}</td>
                                <td className="border px-3 py-2 capitalize">{req.status}</td>
                                <td className="border px-3 py-2 text-xs">
                                    {req.status === "inprogress" ? (
                                        <div className="text-gray-600">
                                            <p className="font-bold">{req.donorName || "Assigned"}</p>
                                            <p>{req.donorEmail || "Contacting..."}</p>
                                        </div>
                                    ) : "---"}
                                </td>

                                {/* Volunteer : Only status update */}
                                {role === "volunteer" && (
                                    <td className="border px-3 py-2">
                                        <select
                                            className="border px-2 py-1 rounded text-sm"
                                            value={req.status}
                                            onChange={(e) => handleStatusUpdate(req._id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="inprogress">In Progress</option>
                                            <option value="done">Done</option>
                                            <option value="canceled">Canceled</option>
                                        </select>
                                    </td>
                                )}

                                {/* Admin : Full access - same as donor */}
                                {role === "admin" && (
                                    <td className="border px-3 py-2">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link
                                                to={`/dashboard/donation-request/${req._id}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link
                                                to={`/dashboard/edit-donation-request/${req._id}`}
                                                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                                title="Edit"
                                            >
                                                <Edit3 size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(req._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            {req.status === "inprogress" && (
                                                <div className="flex flex-col gap-1 ml-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(req._id, "done")}
                                                        className="flex items-center justify-center p-1 bg-green-600 text-white rounded hover:bg-green-700"
                                                        title="Done"
                                                    >
                                                        <CheckCircle size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(req._id, "canceled")}
                                                        className="flex items-center justify-center p-1 bg-red-600 text-white rounded hover:bg-red-700"
                                                        title="Cancel"
                                                    >
                                                        <XCircle size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
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
                            className={`px-3 py-1 border rounded ${page === num + 1 ? "bg-red-600 text-white" : ""
                                }`}
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

export default AllBloodDonationRequest;

