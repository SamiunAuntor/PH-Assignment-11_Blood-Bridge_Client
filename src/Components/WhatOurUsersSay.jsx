import React from "react";
import { AiFillStar } from "react-icons/ai";

const testimonials = [
    {
        name: "Samiun Alim Auntor",
        avatar: "https://i.ibb.co/zVqgbPwD/My-Profile.png",
        text: "BloodBridge is an incredible platform that truly connects people in need with generous blood donors. I had an emergency situation in my family, and through BloodBridge, I was able to find suitable donors in just a few hours. The interface is intuitive, the dashboard provides all the necessary information at a glance, and the filtering system ensures that you can find the right blood type in the right location quickly. I am grateful for the transparency and responsiveness of the platform, which made a stressful situation much more manageable. Highly recommended!",
    },
    {
        name: "Samiha Afrose",
        avatar: "https://i.ibb.co/9m15JSty/Whats-App-Image-2025-12-18-at-9-48-42-PM.jpg",
        text: "As someone who has been volunteering in blood donation campaigns for years, I can confidently say that BloodBridge has revolutionized the way we manage donations and requests. The platform is not only user-friendly but also ensures a high level of accountability and organization. I can monitor all my donation requests, track pending statuses, and even see which donors are available at a glance. This level of detail is incredibly helpful for volunteers and coordinators. I appreciate the seamless integration with mobile devices, which allows me to access everything on the go. Truly a lifesaving tool for the community.",
    },
    {
        name: "Virat Kohli",
        avatar: "https://i.ibb.co/mFFYFH8q/Virat-Kohli.jpg",
        text: "BloodBridge is a remarkable service for anyone looking to donate or receive blood. I had to organize a donation drive for a local community event, and this platform made the process extremely smooth. From creating donation requests to tracking responses and confirming donors, everything was clearly organized. The detailed dashboard and notifications ensure that no request goes unnoticed, and the ability to filter donors by blood type and location is invaluable. I have recommended BloodBridge to friends and colleagues, and everyone has been impressed with its efficiency. This platform truly embodies the spirit of community support and reliability.",
    },
    {
        name: "Shakib Al-Hasan",
        avatar: "https://i.ibb.co/pvqzXWPN/Shakib-Al-Hasan.jpg",
        text: "Finding blood donors quickly can be a stressful and time-sensitive task, but BloodBridge has completely transformed this experience. I was able to connect with multiple donors within a short period, and the system made scheduling and tracking incredibly simple. The platform also provides transparency and reliability, ensuring that all donors are verified and requests are managed professionally. I particularly appreciate the educational resources and tips provided to both donors and recipients, which increase awareness and encourage safe practices. BloodBridge is not just a tool—it’s a community-driven solution that genuinely saves lives and strengthens the bond between donors and recipients.",
    },
];

const WhatOurUsersSay = () => {
    return (
        <section className="py-12 bg-gray-50">
            <div className="w-11/12 mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
                        What Our Users Say
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map((t, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            {/* Top Row*/}
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={t.avatar}
                                    alt={t.name}
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-red-600 flex-shrink-0"
                                />
                                <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between">
                                    <h3 className="font-semibold text-lg text-slate-800">{t.name}</h3>
                                    <div className="flex items-center gap-1 mt-1 md:mt-0">
                                        {Array(5)
                                            .fill(0)
                                            .map((_, i) => (
                                                <AiFillStar key={i} className="text-yellow-400" />
                                            ))}
                                        <span className="ml-2 font-semibold text-sm text-slate-700">5/5</span>
                                    </div>
                                </div>
                            </div>

                            {/* Paragraph */}
                            <p className="text-gray-600 text-sm md:text-base text-justify">{t.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhatOurUsersSay;
