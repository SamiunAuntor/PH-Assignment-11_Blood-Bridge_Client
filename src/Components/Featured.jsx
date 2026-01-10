import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxios from "../Hooks/useAxios";
import Loading from "../Components/Loading";
import { MapPin, Calendar, Clock, Droplets, Eye } from "lucide-react";
import bloodTypeAPositive from "../assets/blood-type-a-positive.png";
import bloodTypeANegative from "../assets/blood-type-a-negitive.png";
import bloodTypeBPositive from "../assets/blood-type-b-positive.png";
import bloodTypeBNegative from "../assets/blood-type-b-negitive.png";
import bloodTypeABPositive from "../assets/blood-type-ab-positive.png";
import bloodTypeABNegative from "../assets/blood-type-ab-negetive.png";
import bloodTypeOPositive from "../assets/blood-type-o-positive.png";
import bloodTypeONegative from "../assets/blood-type-o-negitive.png";

const Featured = () => {
    const axios = useAxios();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [districts, setDistricts] = useState([]);
    const [upzillas, setUpzillas] = useState([]);

    // Load location data
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

    // Fetch latest 8 donation requests
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

    const getBloodTypeImage = (bloodGroup) => {
        const bloodTypeMap = {
            "A+": bloodTypeAPositive,
            "A-": bloodTypeANegative,
            "B+": bloodTypeBPositive,
            "B-": bloodTypeBNegative,
            "AB+": bloodTypeABPositive,
            "AB-": bloodTypeABNegative,
            "O+": bloodTypeOPositive,
            "O-": bloodTypeONegative
        };
        return bloodTypeMap[bloodGroup] || bloodTypeOPositive;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loading />
            </div>
        );
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-red-600">
                        Featured Donation Requests
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Help save lives by responding to urgent requests from your community.
                    </p>
                </div>

                {requests.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {requests.slice(0, 8).map((req) => (
                                <div
                                    key={req._id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                                >
                                    {/* Blood Type Image - Avatar at Top with Padding */}
                                    <div className="p-4 bg-red-50">
                                        <img 
                                            src={getBloodTypeImage(req.bloodGroup)} 
                                            alt={req.bloodGroup}
                                            className="w-full aspect-square object-cover rounded-lg"
                                        />
                                    </div>
                                    
                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-lg font-semibold text-gray-800">{req.recipientName}</h3>
                                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase">
                                                {req.status}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-gray-600 flex-grow">
                                            <div className="flex items-center gap-2">
                                                <Droplets className="text-red-600" size={16} />
                                                <span className="font-semibold text-red-600">{req.bloodGroup}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} />
                                                <span className="text-sm">{getUpazilaName(req.recipientUpazila)}, {getDistrictName(req.recipientDistrict)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} />
                                                <span className="text-sm">{req.donationDate}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} />
                                                <span className="text-sm">{req.donationTime}</span>
                                            </div>
                                        </div>

                                        <Link
                                            to={`/donation-request/${req._id}`}
                                            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            <Eye size={16} /> View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <Link
                                to="/donation-requests"
                                className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Show All Requests
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <p className="text-gray-600 text-lg">No donation requests available at the moment.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Featured;
