import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Eye, Edit3, Trash2, Users, DollarSign, Activity, CheckCircle, XCircle } from "lucide-react";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";
import useRole from "../Hooks/useRole";
import useAxios from "../Hooks/useAxios";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Loading";

const DashboardHome = () => {
    const { role, isLoading } = useRole();
    const { user } = useAuth();
    const axios = useAxios();

    const [recentRequests, setRecentRequests] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalRequests: 0, totalFunding: 5200 });
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
            } catch (err) { console.error(err); }
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

            // 1. Fetch Stats based on Role
            if (role === "admin") {
                const [usersRes, requestsRes] = await Promise.all([
                    axios.get("/dashboard/all-users", { headers }),
                    axios.get("/dashboard/all-blood-donation-request", { headers }),
                ]);
                setStats(prev => ({ ...prev, totalUsers: usersRes.data.total, totalRequests: requestsRes.data.total }));
            } else if (role === "volunteer") {
                const [userCountRes, requestsRes] = await Promise.all([
                    axios.get("/dashboard/total-users-count", { headers }),
                    axios.get("/dashboard/all-blood-donation-request", { headers }),
                ]);
                setStats(prev => ({ ...prev, totalUsers: userCountRes.data.totalUsers, totalRequests: requestsRes.data.total }));
            }

            // 2. Fetch Recent Requests (Hierarchical: Admin/Vol see all, Donor sees mine)
            const requestEndpoint = (role === "admin" || role === "volunteer")
                ? "/dashboard/all-blood-donation-request"
                : "/dashboard/my-donation-requests";

            const res = await axios.get(requestEndpoint, { headers });

            // Handle different response structures if necessary (e.g., res.data.requests vs res.data)
            const data = res.data.requests || res.data;
            const decodedRequests = data.slice(0, 3).map((req) => {
                const { districtName, upazilaName } = decodeLocation(req.recipientDistrict, req.recipientUpazila);
                return { ...req, districtName, upazilaName };
            });
            setRecentRequests(decodedRequests);

        } catch (err) { console.error(err); } finally { setLoadingData(false); }
    };

    useEffect(() => { fetchData(); }, [role, user, districts]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const auth = getAuth();
            const token = await auth.currentUser?.getIdToken();
            await axios.put(`/dashboard/donation-request/${id}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
            Swal.fire("Success", `Request marked as ${newStatus}`, "success");
            fetchData();
        } catch (err) { Swal.fire("Error", "Could not update status", "error"); }
    };

    const handleDelete = async (id) => {
        Swal.fire({ title: "Are you sure?", text: "This cannot be undone!", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6", confirmButtonText: "Yes, delete it!" }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const auth = getAuth();
                    const token = await auth.currentUser?.getIdToken();
                    await axios.delete(`/dashboard/donation-request/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                    Swal.fire("Deleted!", "Request has been removed.", "success");
                    fetchData();
                } catch (err) { Swal.fire("Error", "Delete failed", "error"); }
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
        <div className="p-6 md:p-10 min-h-screen bg-transparent text-left">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                    Welcome, <span className="text-red-600">{user?.displayName || user?.name}</span>!
                </h1>
                <p className="text-slate-600 font-medium mt-1">BloodBridge {role} Dashboard</p>
            </div>

            {/* Stats Cards: Shown for Admin and Volunteer */}
            {(role === "admin" || role === "volunteer") && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard icon={<Users className="text-blue-600" size={28} />} label="Total Users" value={stats.totalUsers} />
                    <StatCard icon={<DollarSign className="text-green-600" size={28} />} label="Total Funding" value={`$${stats.totalFunding}`} />
                    <StatCard icon={<Activity className="text-red-600" size={28} />} label="Donation Requests" value={stats.totalRequests} />
                </div>
            )}

            {/* Table Section: Now shown for everyone (Hierarchical logic handled in fetchData) */}
            {recentRequests.length > 0 ? (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-700">
                        {role === "donor" ? "My Recent Requests" : "Recent Global Requests"}
                    </h2>
                    <div className="overflow-x-auto rounded-2xl border border-white/20 shadow-xl bg-white/40 backdrop-blur-md">
                        <table className="min-w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/50 text-slate-600 uppercase text-xs font-bold tracking-wider">
                                    <th className="px-6 py-4">Recipient</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Blood</th>
                                    <th className="px-6 py-4">Date/Time</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/20 text-slate-700">
                                {recentRequests.map((req) => (
                                    <tr key={req._id} className="hover:bg-white/30 transition-colors">
                                        <td className="px-6 py-4 font-bold">{req.recipientName}</td>
                                        <td className="px-6 py-4 text-sm">{req.upazilaName}, {req.districtName}</td>
                                        <td className="px-6 py-4"><span className="text-red-600 font-black">{req.bloodGroup}</span></td>
                                        <td className="px-6 py-4 text-xs font-medium">{req.donationDate} <br /> {req.donationTime}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusStyles(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <Link to={`/dashboard/donation-request/${req._id}`} className="p-2 text-blue-600 hover:bg-white/60 rounded-full transition"><Eye size={18} /></Link>
                                                <Link to={`/dashboard/edit-donation-request/${req._id}`} className="p-2 text-slate-600 hover:bg-white/60 rounded-full transition"><Edit3 size={18} /></Link>
                                                <button onClick={() => handleDelete(req._id)} className="p-2 text-red-600 hover:bg-white/60 rounded-full transition"><Trash2 size={18} /></button>
                                                {req.status === "inprogress" && (
                                                    <div className="flex gap-1 ml-2">
                                                        <button onClick={() => handleStatusUpdate(req._id, "done")} className="p-1.5 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-lg"><CheckCircle size={14} /></button>
                                                        <button onClick={() => handleStatusUpdate(req._id, "canceled")} className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"><XCircle size={14} /></button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Link to={role === "donor" ? "/dashboard/my-donation-requests" : "/dashboard/all-blood-donation-request"}
                        className="inline-block mt-4 px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200">
                        View All Requests
                    </Link>
                </div>
            ) : (
                <div className="p-12 text-center bg-white/30 backdrop-blur-md rounded-2xl border-2 border-dashed border-slate-300">
                    <p className="text-slate-500 font-medium italic">No donation requests found.</p>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <div className="p-8 bg-white/40 backdrop-blur-md border border-white/40 rounded-3xl flex items-center gap-6 shadow-sm hover:shadow-md transition-all">
        <div className="p-4 bg-white/80 rounded-2xl shadow-inner">{icon}</div>
        <div>
            <p className="text-3xl font-black text-slate-800">{value}</p>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">{label}</p>
        </div>
    </div>
);

export default DashboardHome;