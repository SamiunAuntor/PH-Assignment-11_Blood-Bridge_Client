import React, { useEffect, useState } from "react";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Loading";
import ProtectedRoute from "../PrivateRoutes/ProtectedRoute";
import Swal from "sweetalert2";
import { DollarSign, Calendar, User } from "lucide-react";

const Funding = () => {
    const { user } = useAuth();
    const [fundings, setFundings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [totalFunding, setTotalFunding] = useState(0);

    // Ensure we are on top after redirected to this page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        // Dummy data for payment, will be implemented later
        const startTime = Date.now();
        setLoading(true);
        const dummyFundings = [
            { _id: "1", userName: "John Doe", amount: 500, date: new Date().toISOString() },
            { _id: "2", userName: "Jane Smith", amount: 1000, date: new Date().toISOString() },
            { _id: "3", userName: "Ahmed Khan", amount: 750, date: new Date(Date.now() - 86400000).toISOString() },
            { _id: "4", userName: "Fatima Begum", amount: 300, date: new Date(Date.now() - 172800000).toISOString() },
        ];
        setFundings(dummyFundings);
        setTotalFunding(dummyFundings.reduce((sum, f) => sum + f.amount, 0));
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 400 - elapsedTime);
        setTimeout(() => {
            setLoading(false);
        }, remainingTime);
    }, []);

    const handleDonate = async (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) {
            Swal.fire("Error", "Please enter a valid amount", "error");
            return;
        }

        // Dummy data for payment, will be implemented later
        setSubmitting(true);

        // Simulate API delay
        setTimeout(() => {
            const newFunding = {
                _id: Date.now().toString(),
                userName: user?.displayName || user?.name || "Anonymous",
                amount: parseFloat(amount),
                date: new Date().toISOString(),
            };

            const updatedFundings = [newFunding, ...fundings];
            setFundings(updatedFundings);
            setTotalFunding(updatedFundings.reduce((sum, f) => sum + f.amount, 0));

            Swal.fire("Success", "Thank you for your donation! (Dummy payment - will be implemented later)", "success");
            setShowModal(false);
            setAmount("");
            setSubmitting(false);
        }, 500);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loading />
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-8 pb-12">
                <div className="w-11/12 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                                Funding 💰
                            </h1>
                            <p className="text-gray-600">Support our organization</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="mt-4 md:mt-0 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <DollarSign size={20} />
                            Give Fund
                        </button>
                    </div>

                    {/* Total Funding Card */}
                    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg p-6 mb-8 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-sm font-semibold uppercase tracking-wide">Total Funding</p>
                                <p className="text-4xl font-bold mt-2">${totalFunding.toLocaleString()}</p>
                            </div>
                            <DollarSign size={48} className="opacity-80" />
                        </div>
                    </div>

                    {/* Funding Table */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto -mx-6 md:mx-0">
                            <div className="inline-block min-w-full align-middle px-6 md:px-0">
                                <table className="min-w-full">
                                    <thead className="bg-red-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Donor Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {fundings.length > 0 ? (
                                            fundings.map((funding) => (
                                                <tr key={funding._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <User size={20} className="text-gray-400" />
                                                            <span className="font-medium text-gray-800">{funding.userName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-lg font-bold text-green-600">
                                                            ${funding.amount.toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <Calendar size={16} />
                                                            <span>{new Date(funding.date).toLocaleDateString()}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                                                    No funding records yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Donate Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 md:p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Make a Donation</h2>
                        <p className="text-gray-600 mb-6">
                            {/* Dummy data for payment, will be implemented later */}
                            Note: This is a demo. Payment integration will be implemented later.
                        </p>
                        <form onSubmit={handleDonate}>
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Amount (USD)
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    min="1"
                                    step="0.01"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-red-500"
                                    placeholder="Enter amount"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setAmount("");
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                >
                                    {submitting ? "Processing..." : "Donate"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );
};

export default Funding;

