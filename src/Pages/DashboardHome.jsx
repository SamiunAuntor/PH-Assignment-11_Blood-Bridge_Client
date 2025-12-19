import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Eye, Edit3, Trash2, Users, DollarSign, Activity, CheckCircle, XCircle, User } from "lucide-react";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2"; // Recommended for the confirmation modal
import useRole from "../Hooks/useRole";
import useAxios from "../Hooks/useAxios";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Loading";

const DashboardHome = () => {
    const { role, isLoading } = useRole();
    const { user } = useAuth();
    const axios = useAxios();

    const [recentRequests, setRecentRequests] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalRequests: 0, totalFunding: 5200 }); // Static funding for now
    const [loadingData, setLoadingData] = useState(true);
    const [districts, setDistricts] = useState([]);
    const [upzillas, setUpzillas] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const [distRes, upzRes] = await Promise.all([
                    fetch("/districts.json").then((res) => res.json()),
                    fetch("/upzillas.json").then((res) => res.json()),
                ]);
                setDistricts(distRes);
                setUpzillas(upzRes);
            } catch (err) {
                console.error("Error loading locations:", err);
            }
        };
        fetchLocations();
    }, []);

    const decodeLocation = (districtId, upazilaId) => {
        const district = districts.find((d) => String(d.id) === String(districtId));
        const upazila = upzillas.find((u) => String(u.id) === String(upazilaId));
        return {
            districtName: district ? district.name : districtId,
            upazilaName: upazila ? upazila.name : upazilaId,
        };
    };

    const fetchData = async () => {
        if (!user || !role || districts.length === 0) return;
        setLoadingData(true);

        try {
            const auth = getAuth();
            const token = await auth.currentUser?.getIdToken();
            const headers = { Authorization: `Bearer ${token}` };

            if (role === "donor") {
                const res = await axios.get("/dashboard/my-donation-requests", { headers });

                const decodedRequests = res.data.requests.slice(0, 3).map((req) => {
                    const { districtName, upazilaName } = decodeLocation(
                        req.recipientDistrict,
                        req.recipientUpazila
                    );
                    return { ...req, districtName, upazilaName };
                });

                setRecentRequests(decodedRequests);
            }

            // ADMIN
            if (role === "admin") {
                const [usersRes, requestsRes] = await Promise.all([
                    axios.get("/dashboard/all-users", { headers }),
                    axios.get("/dashboard/all-blood-donation-request", { headers }),
                ]);

                setStats((prev) => ({
                    ...prev,
                    totalUsers: usersRes.data.total,
                    totalRequests: requestsRes.data.total,
                }));
            }

            // VOLUNTEER
            if (role === "volunteer") {
                const requestsRes = await axios.get(
                    "/dashboard/all-blood-donation-request",
                    { headers }
                );

                setStats((prev) => ({
                    ...prev,
                    totalRequests: requestsRes.data.total,
                }));
            }

        } catch (err) {
            console.error("Dashboard fetch error:", err);
        } finally {
            setLoadingData(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, [role, user, districts]);

    // Handle Status Change (Done/Cancel)
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const auth = getAuth();
            const token = await auth.currentUser?.getIdToken();
            await axios.put(`/dashboard/donation-request/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Swal.fire("Success", `Request marked as ${newStatus}`, "success");
            fetchData(); // Refresh list
        } catch (err) {
            Swal.fire("Error", "Could not update status", "error");
        }
    };

    // Handle Delete
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const auth = getAuth();
                    const token = await auth.currentUser?.getIdToken();
                    await axios.delete(`/dashboard/donation-request/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    Swal.fire("Deleted!", "Your request has been deleted.", "success");
                    fetchData();
                } catch (err) {
                    Swal.fire("Error", "Delete failed", "error");
                }
            }
        });
    };

    if (isLoading || loadingData) return <Loading />;

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case "pending": return "bg-orange-100 text-orange-700 border-orange-200";
            case "inprogress": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "done": return "bg-green-100 text-green-700 border-green-200";
            case "canceled": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="p-6 md:p-10 min-h-screen bg-white text-left">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                    Welcome, <span className="text-red-600">{user?.displayName || user?.name}</span>!
                </h1>
                <p className="text-slate-500 mt-2">BloodBridge {role} Dashboard</p>
            </div>

            {role === "donor" && recentRequests.length > 0 ? (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-700">3 Recent Donation Requests</h2>
                    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-600 uppercase text-xs font-bold tracking-wider">
                                    <th className="px-4 py-4">#</th>
                                    <th className="px-4 py-4">Recipient</th>
                                    <th className="px-4 py-4">Location</th>
                                    <th className="px-4 py-4">Blood</th>
                                    <th className="px-4 py-4">Date/Time</th>
                                    <th className="px-4 py-4">Status</th>
                                    <th className="px-4 py-4">Donor Info</th>
                                    <th className="px-4 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {recentRequests.map((req, index) => (
                                    <tr key={req._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 font-medium text-slate-400">{index + 1}</td>
                                        <td className="px-4 py-4 font-semibold">{req.recipientName}</td>
                                        <td className="px-4 py-4 text-sm">
                                            {req.upazilaName}, {req.districtName}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="bg-red-50 text-red-600 px-2 py-1 rounded-md text-xs font-bold">
                                                {req.bloodGroup}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-xs">
                                            {req.donationDate} <br /> {req.donationTime}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusStyles(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-xs">
                                            {req.status === "inprogress" ? (
                                                <div className="text-slate-600">
                                                    <p className="font-bold">{req.donorName || "Assigned"}</p>
                                                    <p>{req.donorEmail || "Contacting..."}</p>
                                                </div>
                                            ) : "---"}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link to={`/dashboard/donation-request/${req._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                    <Eye size={18} />
                                                </Link>
                                                <Link to={`/dashboard/edit-donation-request/${req._id}`} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                                                    <Edit3 size={18} />
                                                </Link>
                                                <button onClick={() => handleDelete(req._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                    <Trash2 size={18} />
                                                </button>

                                                {req.status === "inprogress" && (
                                                    <div className="flex flex-col gap-1 ml-2">
                                                        <button
                                                            onClick={() => handleStatusUpdate(req._id, "done")}
                                                            className="flex items-center justify-center p-1 bg-green-600 text-white rounded hover:bg-green-700" title="Done">
                                                            <CheckCircle size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(req._id, "canceled")}
                                                            className="flex items-center justify-center p-1 bg-red-600 text-white rounded hover:bg-red-700" title="Cancel">
                                                            <XCircle size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Link to="/dashboard/my-donation-requests" className="inline-block mt-4 px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors shadow-md">
                        View All My Requests
                    </Link>
                </div>
            ) : role === "donor" && (
                <div className="p-10 text-center bg-slate-50 rounded-xl border-2 border-dashed">
                    <p className="text-slate-500">You haven't made any donation requests yet.</p>
                </div>
            )}

            {(role === "admin" || role === "volunteer") && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                    <StatCard icon={<Users className="text-blue-600" size={28} />} label="Total Donors" value={stats.totalUsers} />
                    <StatCard icon={<DollarSign className="text-green-600" size={28} />} label="Total Funding" value={`$${stats.totalFunding}`} />
                    <StatCard icon={<Activity className="text-red-600" size={28} />} label="Donation Requests" value={stats.totalRequests} />
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-5">
        <div className="p-4 bg-white rounded-lg shadow-sm">{icon}</div>
        <div>
            <p className="text-2xl font-black text-slate-800">{value}</p>
            <p className="text-slate-500 font-medium text-xs uppercase tracking-widest">{label}</p>
        </div>
    </div>
);

export default DashboardHome;