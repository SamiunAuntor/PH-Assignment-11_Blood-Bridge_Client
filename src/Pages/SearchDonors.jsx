import React, { useEffect, useState } from "react";
import useAxios from "../Hooks/useAxios";
import Loading from "../Components/Loading";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download, Search as SearchIcon } from "lucide-react";

const SearchDonors = () => {
    const axios = useAxios();
    const [bloodGroup, setBloodGroup] = useState("");
    const [district, setDistrict] = useState("");
    const [upazila, setUpazila] = useState("");
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const [districts, setDistricts] = useState([]);
    const [upzillas, setUpzillas] = useState([]);

    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    // Ensure we are on top after redirected
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
                console.error(err);
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
                `/search-donors?bloodGroup=${encodeURIComponent(bloodGroup)}&district=${encodeURIComponent(district)}&upazila=${encodeURIComponent(upazila)}`
            );
            setDonors(res.data.donors || []);
        } catch (err) {
            console.error(err);
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

    const downloadPDF = () => {
        if (!donors || donors.length === 0 || !searched) {
            alert("Please search for donors first!");
            return;
        }

        try {
            const doc = new jsPDF();

            doc.setFontSize(18);
            doc.setTextColor(220, 53, 69);
            doc.text("Blood Donors List", 14, 20);

            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text(`Blood Group: ${bloodGroup}`, 14, 30);
            doc.text(`District: ${getDistrictName(district)}`, 14, 36);
            doc.text(`Upazila: ${getUpazilaName(upazila)}`, 14, 42);
            doc.text(`Total Donors Found: ${donors.length}`, 14, 48);

            const tableColumn = ["Name", "Email", "Location", "Blood Group"];
            const tableRows = donors.map(d => [
                d.name || "N/A",
                d.email || "N/A",
                `${getUpazilaName(d.upazila)}, ${getDistrictName(d.district)}`,
                d.bloodGroup || "N/A"
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 55,
                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                    halign: "center"
                },
                headStyles: {
                    fillColor: [220, 53, 69],
                    textColor: [255, 255, 255],
                    fontStyle: "bold",
                    halign: "center"
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                theme: "grid",
                margin: { top: 55 }
            });

            const fileName = `donors_${bloodGroup}_${getDistrictName(district)}_${Date.now()}.pdf`;
            doc.save(fileName);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    const selectClass =
        "w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-700 text-sm md:text-base";

    return (
        <div className="min-h-screen bg-gray-50 py-4 md:py-8 px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-red-600 mb-2">
                        Search Donors
                    </h1>
                    <p className="text-sm md:text-base text-gray-600">Find blood donors in your area</p>
                </div>

                {/* Search Form */}
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-6 md:mb-8">
                    <form onSubmit={handleSearch} className="flex flex-wrap justify-between gap-4">
                        <div className="flex-1 min-w-[120px] text-center">
                            <label className="block mb-2 text-sm font-semibold text-gray-700">Blood Group</label>
                            <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className={selectClass} required>
                                <option value="">Select</option>
                                {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                            </select>
                        </div>

                        <div className="flex-1 min-w-[120px] text-center">
                            <label className="block mb-2 text-sm font-semibold text-gray-700">District</label>
                            <select value={district} onChange={e => { setDistrict(e.target.value); setUpazila(""); }} className={selectClass} required>
                                <option value="">Select</option>
                                {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>

                        <div className="flex-1 min-w-[120px] text-center">
                            <label className="block mb-2 text-sm font-semibold text-gray-700">Upazila</label>
                            <select value={upazila} onChange={e => setUpazila(e.target.value)} className={selectClass} required disabled={!district}>
                                <option value="">Select</option>
                                {upzillas.filter(u => String(u.district_id) === String(district)).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                        </div>

                        <div className="flex-1 min-w-[120px] flex items-end justify-center">
                            <button type="submit" disabled={loading} className="w-full px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                <SearchIcon size={16} />
                                {loading ? "Searching..." : "Search"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Section */}
                {searched && (
                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center items-center py-12 md:py-20">
                                <Loading />
                            </div>
                        ) : donors.length > 0 ? (
                            <>
                                <div className="flex justify-end mb-4">
                                    <button
                                        type="button"
                                        onClick={downloadPDF}
                                        className="px-4 md:px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center gap-2"
                                    >
                                        <Download size={16} />
                                        Download PDF
                                    </button>
                                </div>

                                {/* Scrollable Table (mobile + desktop) */}
                                <div className="overflow-x-auto w-full border border-gray-200 rounded-md shadow-sm bg-white">
                                    <table className="w-full border-collapse text-center min-w-[600px]">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                {["Avatar", "Name", "Email", "Location", "Blood Group"].map(h => (
                                                    <th key={h} className="px-3 md:px-4 py-3 border border-gray-200 font-bold text-xs md:text-sm uppercase text-slate-700">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {donors.map(d => (
                                                <tr key={d._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-3 md:px-4 py-3 border border-gray-200">
                                                        <img src={d.avatar || "/default-avatar.png"} alt={d.name} className="w-10 h-10 rounded-full object-cover mx-auto" />
                                                    </td>
                                                    <td className="px-3 md:px-4 py-3 border border-gray-200">{d.name}</td>
                                                    <td className="px-3 md:px-4 py-3 border border-gray-200 break-words">{d.email}</td>
                                                    <td className="px-3 md:px-4 py-3 border border-gray-200">{getUpazilaName(d.upazila)}, {getDistrictName(d.district)}</td>
                                                    <td className="px-3 md:px-4 py-3 border border-gray-200 font-bold text-red-600">{d.bloodGroup}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-8 md:p-12 text-center">
                                <p className="text-gray-600 text-base md:text-lg">No donors found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchDonors;
