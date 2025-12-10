import React from "react";
import Marquee from "react-fast-marquee";
import {
    FaHeartbeat,
    FaUsers,
    FaShieldAlt,
    FaPhoneAlt,
    FaHandHoldingHeart,
    FaRegClock,
    FaSearch,
    FaBell,
    FaUserCheck,
    FaHistory
} from "react-icons/fa";

const features = [
    {
        icon: <FaUsers size={32} className="text-red-600" />,
        title: "Find Donors Quickly",
        description: "Search verified donors by blood group, district & upazila."
    },
    {
        icon: <FaHeartbeat size={32} className="text-red-600" />,
        title: "Become a Donor Easily",
        description: "Register in under a minute and start saving lives."
    },
    {
        icon: <FaShieldAlt size={32} className="text-red-600" />,
        title: "Safe & Verified",
        description: "All donor details are verified for accuracy & safety."
    },
    {
        icon: <FaPhoneAlt size={32} className="text-red-600" />,
        title: "24/7 Support",
        description: "We are always available to assist in emergencies."
    },
    {
        icon: <FaHandHoldingHeart size={32} className="text-red-600" />,
        title: "Community Driven",
        description: "Join thousands of donors and build a life-saving community."
    },
    {
        icon: <FaRegClock size={32} className="text-red-600" />,
        title: "Real-Time Updates",
        description: "Get donor availability updates instantly."
    },
    {
        icon: <FaSearch size={32} className="text-red-600" />,
        title: "Smart Donor Search",
        description: "Find donors by group, location, and last donation date."
    },
    {
        icon: <FaBell size={32} className="text-red-600" />,
        title: "Emergency Alerts",
        description: "Get notified when someone nearby needs urgent blood."
    },
    {
        icon: <FaUserCheck size={32} className="text-red-600" />,
        title: "Profile Verification",
        description: "Every profile is checked to maintain trust and safety."
    },
    {
        icon: <FaHistory size={32} className="text-red-600" />,
        title: "Donation History",
        description: "Track your donation activity and contributions."
    }
];

const FeaturedSection = () => {
    return (
        <div className="w-full bg-white py-16 px-6 flex flex-col items-center">

            {/* Heading */}
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-red-600 mb-4">
                    Our Features
                </h2>
                <p className="text-gray-600">
                    Discover the tools and features that make BloodBridge reliable and fast.
                </p>
            </div>

            {/* Marquee Wrapper */}
            <div className="w-full mx-auto">
                <Marquee pauseOnHover={true} speed={50} gradient={false} className="py-4">

                    {features.map((item, idx) => (
                        <div
                            key={idx}
                            className="min-w-[260px] bg-red-100 hover:bg-red-100 transition-all 
                                       p-6 mx-4 rounded-xl shadow-md flex flex-col 
                                       items-center text-center cursor-pointer"
                        >
                            <div className="mb-4">{item.icon}</div>
                            <h3 className="text-xl font-semibold text-red-700 mb-2">
                                {item.title}
                            </h3>
                            <p className="text-gray-700 text-sm">{item.description}</p>
                        </div>
                    ))}

                </Marquee>
            </div>

        </div>
    );
};

export default FeaturedSection;
