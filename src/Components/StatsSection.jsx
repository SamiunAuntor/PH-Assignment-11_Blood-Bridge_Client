import React, { useEffect, useState } from "react";
import useAxios from "../Hooks/useAxios";
import { Users, Droplets, CheckCircle, DollarSign } from "lucide-react";

const StatsSection = () => {
    const axios = useAxios();
    const [stats, setStats] = useState({
        totalActiveUsers: 0,
        totalDonationRequests: 0,
        totalSuccessfulDonations: 0,
        totalFundRaised: 2.5
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("/public-stats");
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [axios]);

    const statCards = [
        {
            icon: <Users size={32} />,
            label: "Total Active Users",
            value: loading ? "..." : stats.totalActiveUsers.toLocaleString(),
            iconColor: "text-blue-600",
            iconBg: "bg-blue-100"
        },
        {
            icon: <Droplets size={32} />,
            label: "Total Donation Requests",
            value: loading ? "..." : stats.totalDonationRequests.toLocaleString(),
            iconColor: "text-red-600",
            iconBg: "bg-red-100"
        },
        {
            icon: <CheckCircle size={32} />,
            label: "Total Successful Donations",
            value: loading ? "..." : stats.totalSuccessfulDonations.toLocaleString(),
            iconColor: "text-green-600",
            iconBg: "bg-green-100"
        },
        {
            icon: <DollarSign size={32} />,
            label: "Total Fund Raised",
            value: loading ? "..." : `$${stats.totalFundRaised}M`,
            iconColor: "text-amber-600",
            iconBg: "bg-amber-100"
        }
    ];

    return (
        <section className="py-12 bg-white">
            <div className="w-11/12 mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
                        Our Impact in Numbers
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Together, we're making a difference in saving lives
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center text-center"
                        >
                            <div className="mb-4">
                                <div className={`${stat.iconBg} ${stat.iconColor} p-3 rounded-lg inline-block`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="w-full">
                                <p className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                                    {stat.value}
                                </p>
                                <p className="text-gray-600 font-medium">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;

