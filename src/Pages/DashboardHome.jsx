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
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const DonationStatusChart = ({ requests }) => {
    const [radius, setRadius] = useState(120); 

    useEffect(() => {
        const updateRadius = () => {
            const width = window.innerWidth;
            if (width < 640) setRadius(60);    
            else setRadius(90);           
        };

        updateRadius(); 
        window.addEventListener("resize", updateRadius);
        return () => window.removeEventListener("resize", updateRadius);
    }, []);

    const statusCount = { pending: 0, inprogress: 0, done: 0, canceled: 0 };
    requests.forEach(r => {
        statusCount[r.status] = (statusCount[r.status] || 0) + 1;
    });

    const data = [
        { name: "Pending", value: statusCount.pending },
        { name: "In Progress", value: statusCount.inprogress },
        { name: "Done", value: statusCount.done },
        { name: "Canceled", value: statusCount.canceled },
    ];

    const COLORS = ["#fb923c", "#facc15", "#22c55e", "#ef4444"];

    return (
        <div className="p-6 bg-white/60 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4 text-slate-800">
                Donation Request Status Overview
            </h3>

            <ResponsiveContainer width="100%" height={360}>
                <PieChart>
                    <Pie data={data} dataKey="value" label outerRadius={radius} stroke="none">
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i]} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

const TimeBasedStatsChart = ({ requests }) => {
    const [timePeriod, setTimePeriod] = useState("today");

    const getCount = () => {
        if (!requests || requests.length === 0) return 0;

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        let startDate = new Date();

        if (timePeriod === "today") {
            // Today only
            startDate = new Date(now);
        } else if (timePeriod === "lastWeek") {
            // Last 7 days
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 7);
        } else if (timePeriod === "lastMonth") {
            // Last 30 days
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 30);
        }

        let count = 0;

        requests.forEach(request => {
            // Use createdAt if available, otherwise use donationDate
            let requestDate;
            if (request.createdAt) {
                requestDate = new Date(request.createdAt);
            } else if (request.donationDate) {
                // Parse date string format (e.g., "2024-01-15")
                const dateParts = request.donationDate.split('-');
                if (dateParts.length === 3) {
                    requestDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
                } else {
                    requestDate = new Date(request.donationDate);
                }
            } else {
                return; // Skip if no date available
            }
            
            if (isNaN(requestDate.getTime())) return; 
            
            requestDate.setHours(0, 0, 0, 0);

            if (requestDate >= startDate && requestDate <= now) {
                count++;
            }
        });

        return count;
    };

    const count = getCount();

    const chartData = [
        { name: "Requests", count: count }
    ];

    return (
        <div className="p-6 bg-white/60 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h3 className="text-lg font-bold text-slate-800">
                    Donation Requests Count
                </h3>
                <select
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-gray-800"
                >
                    <option value="today">Today</option>
                    <option value="lastWeek">Last Week (7 Days)</option>
                    <option value="lastMonth">Last Month (30 Days)</option>
                </select>
            </div>

            <div className="mt-6">
                <div className="text-center mb-6">
                    <p className="text-5xl font-black text-red-600 mb-2">{count}</p>
                    <p className="text-sm text-gray-600 font-semibold">
                        {timePeriod === "today" && "Requests Today"}
                        {timePeriod === "lastWeek" && "Requests in Last 7 Days"}
                        {timePeriod === "lastMonth" && "Requests in Last 30 Days"}
                    </p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#dc2626" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};



const DashboardHome = () => {
    const { role, isLoading } = useRole();
    const { user } = useAuth();
    const axios = useAxios();
    const navigate = useNavigate();

    // Ensure we are on top after redirected to this page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [recentRequests, setRecentRequests] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRequests: 0,
        totalFunding: 2550,
        pendingRequests: 0,
        doneRequests: 0,
    });
    const [loadingData, setLoadingData] = useState(true);
    const [districts, setDistricts] = useState([]);
    const [upzillas, setUpzillas] = useState([]);
    const [chartRequests, setChartRequests] = useState([]);


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

    const fetchChartData = async () => {
        if (role !== "admin") return;

        try {
            const token = await getAuth().currentUser.getIdToken();
            const headers = { Authorization: `Bearer ${token}` };

            const res = await axios.get(
                "/dashboard/all-blood-donation-request?limit=1000",
                { headers }
            );

            setChartRequests(res.data.requests || []);
        } catch (err) {
            console.error("Chart data fetch failed", err);
        }
    };

    useEffect(() => {
        if (role === "admin") {
            fetchChartData();
        }
    }, [role]);



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
            setChartRequests(prev =>
                prev.map(r =>
                    r._id === id ? { ...r, status } : r
                )
            );
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
            setChartRequests(prev => prev.filter(r => r._id !== id));
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
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
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

            {role === "admin" && chartRequests.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    <DonationStatusChart requests={chartRequests} />
                    <TimeBasedStatsChart requests={chartRequests} />
                </div>
            )}


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
                                else navigate('/dashboard/my-donation-requests');
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