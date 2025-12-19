import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import useAxios from "../Hooks/useAxios";
import Loading from "../Components/Loading";
import { User, Mail, MapPin, Droplets } from "lucide-react";

const SearchDonors = () => {
    const axios = useAxios();
    const [searchParams, setSearchParams] = useSearchParams();

    const [bloodGroup, setBloodGroup] = useState("");
    const [district, setDistrict] = useState("");
    const [upazila, setUpazila] = useState("");
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const [districts, setDistricts] = useState([]);
    const [upzillas, setUpzillas] = useState([]);

    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!bloodGroup || !district || !upazila) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true);
        setSearched(true);
        try {
            const res = await axios.get(
                `/search-donors?bloodGroup=${bloodGroup}&district=${district}&upazila=${upazila}`
            );
            setDonors(res.data.donors || []);
        } catch (err) {
            console.error("Search error:", err);
            setDonors([]);
        } finally {
            setLoading(false);
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

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                        Search Donors 🩸
                    </h1>
                    <p className="text-gray-600">Find blood donors in your area</p>
                </div>

                {/* Search Form */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Blood Group
                            </label>
                            <select
                                value={bloodGroup}
                                onChange={(e) => setBloodGroup(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                required
                            >
                                <option value="">Select</option>
                                {bloodGroups.map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                District
                            </label>
                            <select
                                value={district}
                                onChange={(e) => {
                                    setDistrict(e.target.value);
                                    setUpazila("");
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                required
                            >
                                <option value="">Select</option>
                                {districts.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Upazila
                            </label>
                            <select
                                value={upazila}
                                onChange={(e) => setUpazila(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                required
                                disabled={!district}
                            >
                                <option value="">Select</option>
                                {upzillas
                                    .filter(u => String(u.district_id) === String(district))
                                    .map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Searching..." : "Search"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results */}
                {searched && (
                    <div>
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loading />
                            </div>
                        ) : donors.length > 0 ? (
                            <>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    Found {donors.length} Donor{donors.length > 1 ? "s" : ""}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {donors.map((donor) => (
                                        <div
                                            key={donor._id}
                                            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                                        >
                                            <div className="flex items-start gap-4">
                                                <img
                                                    src={donor.avatar || "https://i.ibb.co/HDxczbsV/My-Profile.png"}
                                                    alt={donor.name}
                                                    className="w-16 h-16 rounded-full object-cover border-2 border-red-500"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                                        <User size={18} />
                                                        {donor.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                                        <Mail size={14} />
                                                        {donor.email}
                                                    </p>
                                                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                                        <MapPin size={14} />
                                                        {getUpazilaName(donor.upazila)}, {getDistrictName(donor.district)}
                                                    </p>
                                                    <div className="mt-3 flex items-center gap-2">
                                                        <Droplets className="text-red-600" size={18} />
                                                        <span className="text-lg font-bold text-red-600">
                                                            {donor.bloodGroup}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                <p className="text-gray-600 text-lg">No donors found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchDonors;


