import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxios from "../Hooks/useAxios";
import Loading from "../Components/Loading";
import { MapPin, Calendar, Clock, Droplets, Eye, Search as SearchIcon } from "lucide-react";
import bloodTypeAPositive from "../assets/blood-type-a-positive.png";
import bloodTypeANegative from "../assets/blood-type-a-negitive.png";
import bloodTypeBPositive from "../assets/blood-type-b-positive.png";
import bloodTypeBNegative from "../assets/blood-type-b-negitive.png";
import bloodTypeABPositive from "../assets/blood-type-ab-positive.png";
import bloodTypeABNegative from "../assets/blood-type-ab-negetive.png";
import bloodTypeOPositive from "../assets/blood-type-o-positive.png";
import bloodTypeONegative from "../assets/blood-type-o-negitive.png";

const DonationRequests = () => {
    const axios = useAxios();
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [allRequests, setAllRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [districts, setDistricts] = useState([]);
    const [upzillas, setUpzillas] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [bloodGroupFilter, setBloodGroupFilter] = useState("");
    const [page, setPage] = useState(1);
    
    const CARDS_PER_PAGE = 12;
    const totalPages = Math.ceil(filteredRequests.length / CARDS_PER_PAGE);
    const startIndex = (page - 1) * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;
    const currentPageRequests = filteredRequests.slice(startIndex, endIndex);
    
    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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
            const startTime = Date.now();
            try {
                setLoading(true);
                const res = await axios.get("/donation-requests");
                const fetchedRequests = res.data.requests || [];
                setAllRequests(fetchedRequests);
                setFilteredRequests(fetchedRequests);
                setRequests(fetchedRequests);
            } catch (err) {
                console.error("Failed to fetch requests:", err);
                setAllRequests([]);
                setRequests([]);
            } finally {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, 400 - elapsedTime);
                setTimeout(() => {
                    setLoading(false);
                }, remainingTime);
            }
        };
        fetchRequests();
    }, [axios]);

    // Filter and search requests
    useEffect(() => {
        // Reset to page 1 when search/filter changes
        setPage(1);

        if (allRequests.length === 0) {
            setFilteredRequests([]);
            setRequests([]);
            return;
        }

        // Wait for locations to load before filtering by location
        if (searchQuery.trim() && (districts.length === 0 || upzillas.length === 0)) {
            return;
        }

        let filtered = [...allRequests];

        // Search filter (name, blood group, location)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((req) => {
                const recipientName = (req.recipientName || "").toLowerCase();
                const bloodGroup = (req.bloodGroup || "").toLowerCase();
                
                // Only check location if districts/upzillas are loaded
                let location = "";
                if (districts.length > 0 && upzillas.length > 0) {
                    const districtName = getDistrictName(req.recipientDistrict).toLowerCase();
                    const upazilaName = getUpazilaName(req.recipientUpazila).toLowerCase();
                    location = `${districtName} ${upazilaName}`;
                }

                return (
                    recipientName.includes(query) ||
                    bloodGroup.includes(query) ||
                    location.includes(query)
                );
            });
        }

        // Blood group filter
        if (bloodGroupFilter) {
            filtered = filtered.filter((req) => req.bloodGroup === bloodGroupFilter);
        }

        // Sort by blood group
        const bloodGroupOrder = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
        filtered.sort((a, b) => {
            const indexA = bloodGroupOrder.indexOf(a.bloodGroup);
            const indexB = bloodGroupOrder.indexOf(b.bloodGroup);
            if (indexA === -1 && indexB === -1) return 0;
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });

        setFilteredRequests(filtered);
    }, [searchQuery, bloodGroupFilter, allRequests, districts, upzillas]);

    // Update displayed requests when page or filteredRequests changes
    useEffect(() => {
        const startIdx = (page - 1) * CARDS_PER_PAGE;
        const endIdx = startIdx + CARDS_PER_PAGE;
        setRequests(filteredRequests.slice(startIdx, endIdx));
    }, [page, filteredRequests]);

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

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
            <div className="flex justify-center items-center min-h-screen">
                <Loading />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="w-11/12 mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
                        Blood Donation Requests
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Help save lives by responding to these urgent requests
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-6 items-center">
                    {/* Search Bar - Left */}
                    <div className="w-full md:flex-1" style={{ maxWidth: '720px' }}>
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, blood group, or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-700"
                            />
                        </div>
                    </div>

                    {/* Filter - Right */}
                    <div className="relative w-full md:w-48">
                        <select
                            value={bloodGroupFilter}
                            onChange={(e) => setBloodGroupFilter(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-700 appearance-none bg-white shadow-sm font-semibold"
                        >
                            <option value="">All Blood Groups</option>
                            {bloodGroups.map((bg) => (
                                <option key={bg} value={bg}>
                                    {bg}
                                </option>
                            ))}
                        </select>
                        {/* Down arrow icon */}
                        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                            <svg
                                className="w-4 h-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Count Display */}
                <div className="mb-4 text-lg font-bold text-gray-700">
                    {filteredRequests.length > 0 ? (
                        (() => {
                            const startIdx = (page - 1) * CARDS_PER_PAGE + 1;
                            const endIdx = Math.min(page * CARDS_PER_PAGE, filteredRequests.length);
                            return `Showing ${startIdx} to ${endIdx} of ${filteredRequests.length} requests`;
                        })()
                    ) : (
                        'No requests found'
                    )}
                </div>

                {currentPageRequests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {currentPageRequests.map((req) => (
                            <div
                                key={req._id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                            >
                                {/* Blood Type Image - Avatar at Top with Padding */}
                                <div className="p-4 bg-red-100">
                                    <img 
                                        src={getBloodTypeImage(req.bloodGroup)} 
                                        alt={req.bloodGroup}
                                        className="w-full aspect-square object-cover rounded-lg"
                                    />
                                </div>
                                
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-xl font-bold text-gray-800">{req.recipientName}</h3>
                                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase">
                                            {req.status}
                                        </span>
                                    </div>

                                    <div className="space-y-3 flex-grow">
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
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <p className="text-gray-600 text-lg">
                            {searchQuery || bloodGroupFilter 
                                ? "No donation requests found matching your search criteria." 
                                : "No pending donation requests at the moment."}
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            Prev
                        </button>
                        {[...Array(totalPages).keys()].map((num) => (
                            <button
                                key={num}
                                onClick={() => setPage(num + 1)}
                                className={`px-3 py-1 border rounded hover:bg-gray-50 transition-colors ${page === num + 1 ? "bg-red-600 text-white hover:bg-red-700" : ""}`}
                            >
                                {num + 1}
                            </button>
                        ))}
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonationRequests;


