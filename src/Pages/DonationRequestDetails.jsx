import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import useAxios from "../Hooks/useAxios";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Loading";
import ProtectedRoute from "../PrivateRoutes/ProtectedRoute";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";
import { MapPin, Calendar, Clock, Droplets, Hospital, MessageSquare, User } from "lucide-react";

const DonationRequestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axios = useAxios();
    const { user } = useAuth();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [donating, setDonating] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [districts, setDistricts] = useState([]);
    const [upzillas, setUpzillas] = useState([]);

    useEffect(() => {
        const loadLocations = async () => {
            try {
                const [districtRes, upzillaRes] = await Promise.all([
                    fetch("/districts.json").then(res => res.json()),
                    fetch("/upzillas.json").then(res => res.json()),
                ]);
                setDistricts(districtRes);
                setUpzillas(upzillaRes);
            } catch (err) {
                console.error("Error loading locations:", err);
            }
        };
        loadLocations();
    }, []);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                setLoading(true);
                const auth = getAuth();
                const token = await auth.currentUser?.getIdToken();
                const res = await axios.get(`/donation-request/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRequest(res.data.request);
            } catch (err) {
                console.error("Failed to fetch request:", err);
                Swal.fire("Error", "Failed to load donation request", "error");
                navigate("/donation-requests");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchRequest();
    }, [id, axios, navigate]);

    const handleDonate = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            setDonating(true);
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();

            await axios.put(
                `/donation-request/${id}/donate`,
                {
                    donorName: user.displayName || user.name,
                    donorEmail: user.email,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            Swal.fire("Success", "Thank you for your donation! Status updated to in progress.", "success");
            setShowModal(false);

            const res = await axios.get(`/donation-request/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequest(res.data.request);
        } catch (err) {
            console.error("Donate error:", err);
            Swal.fire("Error", "Failed to process donation", "error");
        } finally {
            setDonating(false);
        }
    };

    const getDistrictName = (id) => {
        const d = districts.find(d => String(d.id) === String(id));
        return d?.name || id;
    };

    const getUpazilaName = (id) => {
        const u = upzillas.find(u => String(u.id) === String(id));
        return u?.name || id;
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">
        <Loading />
    </div>;
    if (!request) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-center">
                <p className="text-red-600 text-lg">Request not found</p>
                <Link to="/donation-requests" className="text-blue-600 hover:underline mt-4 inline-block">
                    Back to Requests
                </Link>
            </div>
        </div>
    );

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-8 px-4 md:px-16">

                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-6 rounded-xl shadow-md">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">{request.recipientName}</h1>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${request.status === "pending" ? "bg-orange-100 text-orange-700" :
                            request.status === "inprogress" ? "bg-yellow-100 text-yellow-700" :
                                request.status === "done" ? "bg-green-100 text-green-700" :
                                    "bg-red-100 text-red-700"
                            }`}>
                            {request.status}
                        </span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-center gap-3">
                            <Droplets className="text-red-600" size={28} />
                            <div>
                                <p className="text-sm text-gray-500">Blood Group</p>
                                <p className="text-xl font-bold text-red-600">{request.bloodGroup}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Calendar className="text-blue-600" size={28} />
                            <div>
                                <p className="text-sm text-gray-500">Donation Date</p>
                                <p className="text-lg font-semibold">{request.donationDate}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Clock className="text-green-600" size={28} />
                            <div>
                                <p className="text-sm text-gray-500">Donation Time</p>
                                <p className="text-lg font-semibold">
                                    {request.donationTime} {Number(request.donationTime.split(":")[0]) < 12 ? "AM" : "PM"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <MapPin className="text-purple-600" size={28} />
                            <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="text-lg font-semibold">
                                    {getUpazilaName(request.recipientUpazila)}, {getDistrictName(request.recipientDistrict)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Hospital Info */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <Hospital className="text-indigo-600" size={28} />
                            <h3 className="text-lg font-semibold">Hospital</h3>
                        </div>
                        <p className="text-gray-700 ml-10">{request.hospitalName}</p>
                        <p className="text-gray-600 ml-10 text-sm">{request.address}</p>
                    </div>

                    {/* Message */}
                    {request.message && (
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <div className="flex items-center gap-3 mb-2">
                                <MessageSquare className="text-pink-600" size={28} />
                                <h3 className="text-lg font-semibold">Request Message</h3>
                            </div>
                            <p className="text-gray-700 ml-10">{request.message}</p>
                        </div>
                    )}

                    {/* Requester Info */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <User className="text-gray-600" size={28} />
                            <h3 className="text-lg font-semibold">Requester Information</h3>
                        </div>
                        <div className="ml-10 space-y-1">
                            <p className="text-gray-700"><strong>Name:</strong> {request.requesterName}</p>
                            <p className="text-gray-700"><strong>Email:</strong> {request.requesterEmail}</p>
                        </div>
                    </div>

                    {/* Assigned Donor */}
                    {request.status === "inprogress" && request.donorName && (
                        <div className="bg-yellow-50 p-6 rounded-xl shadow-md border border-yellow-200">
                            <h3 className="font-semibold text-yellow-800 mb-2">Assigned Donor</h3>
                            <p className="text-yellow-700"><strong>Name:</strong> {request.donorName}</p>
                            <p className="text-yellow-700"><strong>Email:</strong> {request.donorEmail}</p>
                        </div>
                    )}

                    {/* Donate Button */}
                    {request.status === "pending" && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full md:w-auto px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Donate Blood
                        </button>
                    )}
                </div>

                {/* Donate Modal */}
                {showModal && (
                    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-6 md:p-8 max-w-md w-full shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Donation</h2>
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Donor Name</label>
                                    <input
                                        type="text"
                                        value={user?.displayName || user?.name || ""}
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Donor Email</label>
                                    <input
                                        type="email"
                                        value={user?.email || ""}
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDonate}
                                    disabled={donating}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                >
                                    {donating ? "Processing..." : "Confirm"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
};

export default DonationRequestDetails;
