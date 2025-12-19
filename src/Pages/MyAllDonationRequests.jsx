import React, { useEffect, useState } from "react";
import useAxios from "../Hooks/useAxios";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Loading";
import { getAuth } from "firebase/auth";

const LIMIT = 10;

const MyAllDonationRequests = () => {
    const axios = useAxios();
    const { user } = useAuth();

    const [requests, setRequests] = useState([]);
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const [districts, setDistricts] = useState([]);
    const [upzillas, setUpzillas] = useState([]);

    const totalPages = Math.ceil(total / LIMIT);

    /*Fetch location JSON data */
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
        const district = districts.find(d => d.id === districtId);
        const upazila = upzillas.find(u => u.id === upazilaId);

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
                    `/dashboard/my-donation-requests?status=${status}&page=${page}&limit=${LIMIT}`,
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
            } finally {
                setLoading(false);
            }
        };

        if (user && districts.length && upzillas.length) {
            fetchRequests();
        }
    }, [user, status, page, districts, upzillas, axios]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loading />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-red-600">
                My Donation Requests 🩸
            </h1>

            {/* Filter  */}
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
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-red-100">
                        <tr>
                            <th className="border px-3 py-2">Recipient Name</th>
                            <th className="border px-3 py-2">Location</th>
                            <th className="border px-3 py-2">Blood Group</th>
                            <th className="border px-3 py-2">Date</th>
                            <th className="border px-3 py-2">Time</th>
                            <th className="border px-3 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req._id} className="text-center">
                                <td className="border px-3 py-2">{req.recipientName}</td>
                                <td className="border px-3 py-2">
                                    {req.recipientDistrictName}, {req.recipientUpazilaName}
                                </td>
                                <td className="border px-3 py-2">{req.bloodGroup}</td>
                                <td className="border px-3 py-2">{req.donationDate}</td>
                                <td className="border px-3 py-2">{req.donationTime}</td>
                                <td className="border px-3 py-2 capitalize">{req.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/*  Pagination  */}
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

export default MyAllDonationRequests;
