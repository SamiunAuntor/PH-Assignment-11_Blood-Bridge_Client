import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, Mail, Droplets, Calendar, ShieldCheck, Edit2, Save, X } from "lucide-react";
import useAxios from "../Hooks/useAxios";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Loading";
import { getAuth, updateProfile } from "firebase/auth";
import Swal from "sweetalert2";
import { uploadImageToImgBB } from "../Utilities/UploadImage";

const UserProfile = () => {
    const axios = useAxios();
    const { user, loading } = useAuth();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [divisions, setDivisions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [upzillas, setUpzillas] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        bloodGroup: "",
        district: "",
        upazila: "",
        avatar: "",
    });

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

    // Initialize form data when profile loads
    useEffect(() => {
        if (data) {
            setFormData({
                name: data.name || "",
                bloodGroup: data.bloodGroup || "",
                district: data.district || "",
                upazila: data.upazila || "",
                avatar: data.avatar || "",
            });
        }
    }, [data]);

    const handleSave = async () => {
        try {
            setSaving(true);
            const auth = getAuth();
            const currentUser = auth.currentUser;
            const token = await currentUser.getIdToken();

            // Update Backend
            await axios.put(
                "/dashboard/profile",
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Update Firebase Auth Profile
            if (currentUser) {
                await updateProfile(currentUser, {
                    displayName: formData.name,
                    photoURL: formData.avatar,
                });
                // Force refresh local user object
                await currentUser.reload();
            }

            Swal.fire("Success", "Profile updated successfully", "success");
            setIsEditing(false);
            // Refetch profile data
            await queryClient.invalidateQueries(["userProfile", user?.email]);
        } catch (err) {
            console.error("Update error:", err);
            Swal.fire("Error", "Failed to update profile", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (data) {
            setFormData({
                name: data.name || "",
                bloodGroup: data.bloodGroup || "",
                district: data.district || "",
                upazila: data.upazila || "",
                avatar: data.avatar || "",
            });
        }
        setIsEditing(false);
    };

    if (loading || profileLoading) return <div className="flex items-center justify-center min-h-screen">
        <Loading />
    </div>;
    if (error || !data) return <div className="p-20 text-center text-red-500">Error loading profile details.</div>;

    // Compute location names
    const districtObj = districts.find((d) => String(d.id) === String(data.district || data.recipientDistrict));
    const upazilaObj = upzillas.find((u) => String(u.id) === String(data.upazila || data.recipientUpazila));
    const divisionObj = divisions.find((div) => div.id === (districtObj?.division_id || upazilaObj?.division_id));

    const districtName = districtObj?.name || "N/A";
    const upazilaName = upazilaObj?.name || "N/A";
    const divisionName = divisionObj?.name || "N/A";

    const filteredUpzillas = upzillas.filter((u) => {
        const selectedDistrict = formData.district || data.district;
        return String(u.district_id) === String(selectedDistrict);
    });

    return (
        <div className=" bg-gray-100 flex flex-col">
            {/* Banner Header */}
            <div className="relative bg-slate-900 flex flex-col md:flex-row items-center md:items-end px-6 pt-6 pb-6 md:pb-10"
                style={{ minHeight: "18rem" }}>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>

                <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 w-full max-w-6xl mx-auto">

                    <div className="relative">
                        <img
                            src={formData.avatar || data.avatar || user?.photoURL || "https://i.ibb.co/Y71cMmLF/random-avatar.png"}
                            alt="Profile"
                            className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover object-top border-4 border-white shadow-2xl"
                        />
                        <span
                            className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg ${data.status === "pending"
                                    ? "bg-yellow-500"
                                    : data.status === "blocked"
                                        ? "bg-red-600"
                                        : "bg-green-500"
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

                    <div className="mt-4 md:mt-0 flex gap-2">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-5 py-2 bg-white text-red-600 font-semibold rounded-lg shadow hover:bg-white/90 transition flex items-center gap-2"
                            >
                                <Edit2 size={18} />
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    {saving ? "Saving..." : "Save"}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-5 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 transition flex items-center gap-2"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>


            {/* 4 Cards Grid */}
            <main className="flex-1 mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-10">
                <Card title="Health Profile">
                    {isEditing ? (
                        <div className="space-y-4 h-full">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                                    Blood Group
                                </label>
                                <select
                                    value={formData.bloodGroup}
                                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="">Select</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100 h-full">
                            <div className="p-3 bg-red-600 rounded-lg text-white">
                                <span className="flex items-center justify-center"><Droplets size={24} /></span>
                            </div>
                            <div>
                                <p className="text-sm text-red-800 font-medium">Blood Group</p>
                                <p className="text-2xl font-black text-red-600">{data.bloodGroup || "O+"}</p>
                            </div>
                        </div>
                    )}
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
                    {isEditing ? (
                        <div className="space-y-4 h-full">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                                    Email (Read Only)
                                </label>
                                <input
                                    type="email"
                                    value={data.email || data.requesterEmail}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                                    Avatar URL
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={formData.avatar}
                                        onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                        placeholder="Enter image URL"
                                    />
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Or upload image:</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    try {
                                                        const url = await uploadImageToImgBB(file);
                                                        setFormData({ ...formData, avatar: url });
                                                        Swal.fire({ icon: "success", title: "Uploaded!", timer: 1000, showConfirmButton: false });
                                                    } catch (err) {
                                                        Swal.fire("Error", "Failed to upload image", "error");
                                                    }
                                                }
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 h-full">
                            <InfoItem label="Full Name" value={data.name || data.requesterName} />
                            <InfoItem label="Email" value={data.email || data.requesterEmail} />
                        </div>
                    )}
                </Card>

                <Card title="Current Location">
                    {isEditing ? (
                        <div className="space-y-4 h-full">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                                    District
                                </label>
                                <select
                                    value={formData.district}
                                    onChange={(e) => setFormData({ ...formData, district: e.target.value, upazila: "" })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="">Select District</option>
                                    {districts.map((d) => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                                    Upazila
                                </label>
                                <select
                                    value={formData.upazila}
                                    onChange={(e) => setFormData({ ...formData, upazila: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                    disabled={!formData.district}
                                >
                                    <option value="">Select Upazila</option>
                                    {filteredUpzillas.map((u) => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-4 h-full">
                            <MapPin size={24} className="text-red-600 mt-1" />
                            <div>
                                <p className="text-lg font-medium text-slate-700">{upazilaName}, {districtName}</p>
                                <p className="text-sm text-slate-500">{divisionName} Division</p>
                            </div>
                        </div>
                    )}
                </Card>
            </main>
        </div>
    );
};

// Card component
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