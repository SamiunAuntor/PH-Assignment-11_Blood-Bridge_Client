import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
    Eye,
    Edit3,
    Trash2,
    Users,
    DollarSign,
    Activity,
    CheckCircle,
    XCircle,
    Clock,
    CheckSquare
} from "lucide-react";
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
    const navigate = useNavigate();

    const [recentRequests, setRecentRequests] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRequests: 0,
        totalFunding: 5200,
        pendingRequests: 0,
        doneRequests: 0,
    });
    const [loadingData, setLoadingData] = useState(true);
    const [districts, setDistricts] = useState([]);
    const [upzillas, setUpzillas] = useState([]);

    /* Load Location Data */
    useEffect(() => {
        Promise.all([
            fetch("/districts.json").then((r) => r.json()),
            fetch("/upzillas.json").then((r) => r.json()),
        ]).then(([d, u]) => {
            setDistricts(d);
            setUpzillas(u);
        });
    }, []);

    const decodeLocation = (districtId, upazilaId) => {
        const district = districts.find((d) => `${d.id}` === `${districtId}`);
        const upazila = upzillas.find((u) => `${u.id}` === `${upazilaId}`);
        return {
            districtName: district?.name || districtId,
            upazilaName: upazila?.name || upazilaId,
        };
    };

    /* Fetch Data */
    const fetchData = async () => {
        if (!user || !role || districts.length === 0) return;
        setLoadingData(true);

        try {
            const token = await getAuth().currentUser.getIdToken();
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch Stats for Admin/Volunteer
            if (role === "admin" || role === "volunteer") {
                const [usersRes, reqRes] = await Promise.all([
                    axios.get("/dashboard/total-users-count", { headers }),
                    axios.get("/dashboard/all-blood-donation-request", { headers }),
                ]);

                setStats((prev) => ({
                    ...prev,
                    totalUsers: usersRes.data.totalUsers,
                    totalRequests: reqRes.data.total,
                }));
            }

            const endpoint =
                role === "donor"
                    ? "/dashboard/my-donation-requests"
                    : "/dashboard/all-blood-donation-request";

            const res = await axios.get(endpoint, { headers });
            const data = res.data.requests || res.data;

            // Donor specific stats calculation
            if (role === "donor") {
                const pending = data.filter(r => r.status === 'pending').length;
                const done = data.filter(r => r.status === 'done').length;
                setStats(prev => ({
                    ...prev,
                    totalRequests: data.length,
                    pendingRequests: pending,
                    doneRequests: done
                }));
            }

            setRecentRequests(
                data.slice(0, 3).map((r) => ({
                    ...r,
                    ...decodeLocation(r.recipientDistrict, r.recipientUpazila),
                }))
            );
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [role, user, districts]);

    /* Status Update */
    const handleStatusUpdate = async (id, status) => {
        const confirm = await Swal.fire({
            title: "Update Status?",
            text: `Do you want to mark this request as ${status}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: status === 'done' ? "#16a34a" : "#dc2626",
            confirmButtonText: "Yes, Update",
        });

        if (!confirm.isConfirmed) return;

        try {
            const token = await getAuth().currentUser.getIdToken();
            const endpoint =
                role === "donor"
                    ? `/dashboard/my-donation-request/${id}/status`
                    : `/dashboard/donation-request/${id}/status`;

            await axios.put(
                endpoint,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await Swal.fire("Success", `Marked as ${status}`, "success");
            fetchData();
        } catch {
            Swal.fire("Error", "Status update failed", "error");
        }
    };

    /* DELETE */
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (!confirm.isConfirmed) return;

        try {
            const token = await getAuth().currentUser.getIdToken();
            await axios.delete(`/dashboard/donation-request/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await Swal.fire("Deleted!", "Request removed.", "success");
            fetchData();
        } catch {
            Swal.fire("Error", "Delete failed", "error");
        }
    };

    const loadingAll = isLoading || loadingData;

    if (loadingAll) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading />
            </div>
        );
    }



    const statusStyle = (s) =>
    ({
        pending: "bg-orange-100 text-orange-700 border-orange-200",
        inprogress: "bg-yellow-100 text-yellow-700 border-yellow-200",
        done: "bg-green-100 text-green-700 border-green-200",
        canceled: "bg-red-100 text-red-700 border-red-200",
    }[s] || "bg-gray-100 text-gray-700");

    return (
        <div className="p-6 md:p-10 min-h-screen bg-transparent">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-800">
                    Welcome, <span className="text-red-600">{user?.displayName}</span>! 👋😃
                </h1>
                <p className="text-slate-600 font-medium mt-1">
                    BloodBridge {role} Dashboard
                </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {role === "donor" ? (
                    <>
                        <StatCard icon={<Activity className="text-blue-600" />} label="My Total Requests" value={stats.totalRequests} />
                        <StatCard icon={<Clock className="text-orange-600" />} label="Pending Requests" value={stats.pendingRequests} />
                        <StatCard icon={<CheckSquare className="text-green-600" />} label="Successful Donations" value={stats.doneRequests} />
                    </>
                ) : (
                    <>
                        <StatCard icon={<Users className="text-red-600" />} label="Total Users" value={stats.totalUsers} />
                        <StatCard icon={<DollarSign className="text-emerald-600" />} label="Total Funding" value={`$${stats.totalFunding}`} />
                        <StatCard icon={<Activity className="text-blue-600" />} label="Donation Requests" value={stats.totalRequests} />
                    </>
                )}
            </div>

            {recentRequests.length > 0 ? (
                <div>
                    <h2 className="text-xl font-bold text-slate-700 mb-4">
                        Recent Requests
                    </h2>

                    {/* Scrollable Container for Table */}
                    <div className="w-full overflow-x-auto border-0">
                        <table className="min-w-full border-collapse bg-white">
                            <thead>
                                <tr className="text-center bg-gray-50">
                                    <th className="px-4 py-3 border border-gray-200 font-bold text-xs uppercase text-slate-700">Recipient</th>
                                    <th className="px-4 py-3 border border-gray-200 font-bold text-xs uppercase text-slate-700">Location</th>
                                    <th className="px-4 py-3 border border-gray-200 font-bold text-xs uppercase text-slate-700">Blood</th>
                                    <th className="px-4 py-3 border border-gray-200 font-bold text-xs uppercase text-slate-700">Date</th>
                                    <th className="px-4 py-3 border border-gray-200 font-bold text-xs uppercase text-slate-700">Time</th>
                                    <th className="px-4 py-3 border border-gray-200 font-bold text-xs uppercase text-slate-700">Status</th>
                                    <th className="px-4 py-3 border border-gray-200 font-bold text-xs uppercase text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {recentRequests.map((r) => (
                                    <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 border border-gray-200 text-sm font-medium">{r.recipientName}</td>
                                        <td className="px-4 py-3 border border-gray-200 text-sm">
                                            {r.upazilaName}, {r.districtName}
                                        </td>
                                        <td className="px-4 py-3 border border-gray-200 font-black text-red-600 text-sm">
                                            {r.bloodGroup}
                                        </td>
                                        <td className="px-4 py-3 border border-gray-200 text-sm">{r.donationDate}</td>
                                        <td className="px-4 py-3 border border-gray-200 text-sm">{r.donationTime}</td>
                                        <td className="px-4 py-3 border border-gray-200">
                                            <span className={`px-3 py-1 rounded-sm text-[10px] font-bold border ${statusStyle(r.status)} inline-block`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 border border-gray-200">
                                            <div className="flex items-center justify-center gap-1">
                                                <Link to={`/dashboard/donation-request/${r._id}`} className="p-1.5 border border-gray-200 rounded-sm hover:bg-gray-100"><Eye size={16} /></Link>

                                                {/* Only show Edit/Delete for admins */}
                                                {role === "admin" && (
                                                    <>
                                                        <Link to={`/dashboard/edit-donation-request/${r._id}`} className="p-1.5 border border-gray-200 rounded-sm hover:bg-gray-100 text-blue-600"><Edit3 size={16} /></Link>
                                                        <button onClick={() => handleDelete(r._id)} className="p-1.5 border border-gray-200 rounded-sm hover:bg-gray-100 text-red-600"><Trash2 size={16} /></button>
                                                    </>
                                                )}

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

                    {/* See All Requests Button */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                if (role === "donor") navigate('/dashboard/my-donation-requests');
                                else navigate('/dashboard/all-blood-donation-request');
                            }}
                            className="px-8 py-3 bg-slate-800 text-white font-bold text-sm rounded-md shadow-lg hover:bg-slate-900 transition-all uppercase tracking-widest"
                        >
                            See All My Requests
                        </button>
                    </div>

                </div>
            ) : (
                <div className="p-12 text-center bg-white/30 rounded-lg border-dashed border-2 border-gray-300">
                    No donation requests found.
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <div className="p-8 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm flex items-center gap-6">
        <div className="p-4 bg-white rounded-lg shadow-inner">{icon}</div>
        <div>
            <p className="text-3xl font-black text-slate-800">{value}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
        </div>
    </div>
);

export default DashboardHome;