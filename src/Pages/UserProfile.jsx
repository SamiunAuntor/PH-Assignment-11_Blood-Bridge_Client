import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Mail, Droplets, Calendar, User, ShieldCheck } from "lucide-react";
import useAxios from "../Hooks/useAxios";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Loading";

const UserProfile = () => {
    const axios = useAxios();
    const { user, loading } = useAuth();

    const [divisions, setDivisions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [upzillas, setUpzillas] = useState([]);

    // Load location JSONs
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const [divRes, distRes, upzRes] = await Promise.all([
                    fetch("/divisions.json"),
                    fetch("/districts.json"),
                    fetch("/upzillas.json"),
                ]);
                const [divData, distData, upzData] = await Promise.all([
                    divRes.json(),
                    distRes.json(),
                    upzRes.json(),
                ]);
                setDivisions(divData);
                setDistricts(distData);
                setUpzillas(upzData);
            } catch (err) {
                console.error("Error loading location data:", err);
            }
        };
        fetchLocations();
    }, []);

    // Fetch profile data
    const { data, isLoading: profileLoading, error } = useQuery(
        ["userProfile", user?.email],
        async () => {
            if (!user) return null;
            const token = await user.getIdToken();
            const res = await axios.get("/dashboard/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data.user;
        },
        { enabled: !!user }
    );

    if (loading || profileLoading) return <div className="flex items-center justify-center min-h-screen">
        <Loading />
    </div>;
    if (error || !data) return <div className="p-20 text-center text-red-500">Error loading profile details.</div>;

    // Compute location names
    const districtObj = districts.find((d) => d.id === (data.district || data.recipientDistrict));
    const upazilaObj = upzillas.find((u) => u.id === (data.upazila || data.recipientUpazila));
    const divisionObj = divisions.find((div) => div.id === (districtObj?.division_id || upazilaObj?.division_id));

    const districtName = districtObj?.name || "N/A";
    const upazilaName = upazilaObj?.name || "N/A";
    const divisionName = divisionObj?.name || "N/A";

    return (
        <div className=" bg-gray-100 flex flex-col">
            {/* Banner Header */}
            <div className="relative bg-slate-900 flex flex-col md:flex-row items-center md:items-end px-6 pt-6 pb-6 md:pb-10"
                style={{ minHeight: "18rem" }}>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>

                <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 w-full max-w-6xl mx-auto">

                    <div className="relative">
                        <img
                            src={data.avatar || "https://i.ibb.co/HDxczbsV/My-Profile.png"}
                            alt="Profile"
                            className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover object-top border-4 border-white shadow-2xl"
                        />
                        <span
                            className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg ${data.status === "pending" ? "bg-yellow-500" : "bg-green-500"
                                }`}
                        >
                            {data.status || "Active"}
                        </span>
                    </div>

                    <div className="flex-1 text-center md:text-left text-white">
                        <h1 className="text-2xl md:text-4xl font-extrabold">{data.name || data.requesterName}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                            <Mail className="mt-1" size={16} />
                            <span className="text-sm md:text-base">{data.email || data.requesterEmail}</span>
                        </div>
                    </div>

                    <div className="mt-4 md:mt-0">
                        <button className="px-5 py-2 bg-white text-red-600 font-semibold rounded-lg shadow hover:bg-white/90 transition">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>


            {/* 4 Cards Grid */}
            <main className="flex-1 mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-10">
                <Card title="Health Profile">
                    <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100 h-full">
                        <div className="p-3 bg-red-600 rounded-lg text-white">
                            <Droplets size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-red-800 font-medium">Blood Group</p>
                            <p className="text-2xl font-black text-red-600">{data.bloodGroup || "O+"}</p>
                        </div>
                    </div>
                </Card>

                <Card title="Account Security">
                    <div className="space-y-4 h-full">
                        <InfoRow icon={<ShieldCheck className="text-slate-400" size={20} />} label="System Role" value={data.role || "Donor"} />
                        <InfoRow
                            icon={<Calendar className="text-slate-400" size={20} />}
                            label="Member Since"
                            value={new Date(data.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        />
                    </div>
                </Card>

                <Card title="Personal Information">
                    <div className="grid grid-cols-1 gap-4 h-full">
                        <InfoItem label="Full Name" value={data.name || data.requesterName} />
                        <InfoItem label="Email" value={data.email || data.requesterEmail} />
                    </div>
                </Card>

                <Card title="Current Location">
                    <div className="flex items-start gap-4 h-full">
                        <MapPin size={24} className="text-red-600 mt-1" />
                        <div>
                            <p className="text-lg font-medium text-slate-700">{upazilaName}, {districtName}</p>
                            <p className="text-sm text-slate-500">{divisionName} Division</p>
                        </div>
                    </div>
                </Card>
            </main>
        </div>
    );
};

// Card component (one time use, defined here for simplicity)
const Card = ({ title, children }) => (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">{title}</h3>
        <div className="flex-1">{children}</div>
    </section>
);

const InfoItem = ({ label, value }) => (
    <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-lg text-slate-700 font-medium">{value || "Not Provided"}</p>
    </div>
);

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-3">
        {icon}
        <div>
            <p className="text-xs text-slate-500 uppercase">{label}</p>
            <p className="text-sm font-semibold text-slate-700">{value}</p>
        </div>
    </div>
);

export default UserProfile;
