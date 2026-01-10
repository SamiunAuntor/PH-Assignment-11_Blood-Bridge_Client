import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxios from "../Hooks/useAxios";
import Loading from "../Components/Loading";
import { MapPin, Calendar, Clock, Droplets, Eye } from "lucide-react";

const DonationRequests = () => {
    const axios = useAxios();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [districts, setDistricts] = useState([]);
    const [upzillas, setUpzillas] = useState([]);

    // Ensure we are on top after redirected to loginn page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
        const fetchRequests = async () => {
            try {
                setLoading(true);
                const res = await axios.get("/donation-requests");
                setRequests(res.data.requests || []);
            } catch (err) {
                console.error("Failed to fetch requests:", err);
                setRequests([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [axios]);

    const getDistrictName = (id) => {
        const d = districts.find(d => String(d.id) === String(id));
        return d?.name || id;
    };

    const getUpazilaName = (id) => {
        const u = upzillas.find(u => String(u.id) === String(id));
        return u?.name || id;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loading />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8 pb-12">
            <div className="w-11/12 mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                        Blood Donation Requests
                    </h1>
                    <p className="text-gray-600">Help save lives by responding to these urgent requests</p>
                </div>

                {requests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {requests.map((req) => (
                            <div
                                key={req._id}
                                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-800">{req.recipientName}</h3>
                                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase">
                                        {req.status}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Droplets className="text-red-600" size={18} />
                                        <span className="font-semibold text-red-600">{req.bloodGroup}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin size={18} />
                                        <span className="text-sm">
                                            {getUpazilaName(req.recipientUpazila)}, {getDistrictName(req.recipientDistrict)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar size={18} />
                                        <span className="text-sm">{req.donationDate}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock size={18} />
                                        <span className="text-sm">{req.donationTime}</span>
                                    </div>
                                </div>

                                <Link
                                    to={`/donation-request/${req._id}`}
                                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <Eye size={18} />
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <p className="text-gray-600 text-lg">No pending donation requests at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonationRequests;


