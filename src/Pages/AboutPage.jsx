import React, { useEffect } from "react";
import {
    ShieldCheck,
    FileText,
    Search,
    Smartphone,
    Bell,
    Loader,
    FolderOpen,
    Play,
    RotateCw,
    CheckCircle,
    BarChart3
} from "lucide-react";
import {
    FaReact,
    FaNodeJs,
    FaDatabase,
    FaFire,
    FaCss3Alt,
    FaDownload,
    FaLayerGroup
} from "react-icons/fa";
import { SiExpress, SiMongodb, SiTailwindcss, SiAxios, SiVite } from "react-icons/si";

const AboutPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const capabilities = [
        {
            icon: <ShieldCheck className="text-red-600" size={24} />,
            title: "Authentication",
            description: "Secure user registration and login with Firebase."
        },
        {
            icon: <FileText className="text-red-600" size={24} />,
            title: "Donation Management",
            description: "Create, view, edit, and manage donation requests."
        },
        {
            icon: <Search className="text-red-600" size={24} />,
            title: "Dynamic Search",
            description: "Search donors by blood group, location, and availability."
        },
        {
            icon: <FileText className="text-red-600" size={24} />,
            title: "PDF Downloads",
            description: "Export search results and donation records as PDF."
        },
        {
            icon: <Search className="text-red-600" size={24} />,
            title: "Category Filtering",
            description: "Filter requests by status, location, and blood group."
        },
        {
            icon: <Smartphone className="text-red-600" size={24} />,
            title: "Responsive UI",
            description: "Fully responsive design for all devices."
        },
        {
            icon: <Bell className="text-red-600" size={24} />,
            title: "Toast & SweetAlert",
            description: "Beautiful notifications and confirmation dialogs."
        },
        {
            icon: <Loader className="text-red-600" size={24} />,
            title: "Loading Spinners",
            description: "Smooth loading indicators for better UX."
        },
        {
            icon: <FolderOpen className="text-red-600" size={24} />,
            title: "Role-Based Access",
            description: "Admin, Volunteer, and Donor role management."
        },
        {
            icon: <Play className="text-red-600" size={24} />,
            title: "Real-Time Updates",
            description: "Live status updates for donation requests."
        },
        {
            icon: <RotateCw className="text-red-600" size={24} />,
            title: "Status Management",
            description: "Track donation request status changes."
        },
        {
            icon: <ShieldCheck className="text-red-600" size={24} />,
            title: "Data Security",
            description: "Secure data handling with JWT authentication."
        }
    ];

    const technologies = [
        { name: "React 19", icon: <FaReact className="text-blue-500" size={24} /> },
        { name: "Vite 7", icon: <SiVite className="text-yellow-500" size={24} /> },
        { name: "Node.js", icon: <FaNodeJs className="text-green-600" size={24} /> },
        { name: "Express.js", icon: <SiExpress className="text-gray-800" size={24} /> },
        { name: "MongoDB", icon: <SiMongodb className="text-green-700" size={24} /> },
        { name: "Firebase", icon: <FaFire className="text-orange-500" size={24} /> },
        { name: "Tailwind CSS", icon: <SiTailwindcss className="text-cyan-500" size={24} /> },
        { name: "DaisyUI", icon: <FaLayerGroup className="text-purple-600" size={24} /> },
        { name: "Axios", icon: <SiAxios className="text-blue-600" size={24} /> },
        { name: "jsPDF", icon: <FileText className="text-red-600" size={24} /> },
        { name: "Recharts", icon: <BarChart3 className="text-blue-400" size={24} /> },
        { name: "SweetAlert2", icon: <Bell className="text-pink-500" size={24} /> }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 pb-12">
            <div className="w-11/12 mx-auto space-y-8">
                
                {/* About BloodBridge Header */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-4xl font-bold text-red-600 mb-4">
                        About BloodBridge
                    </h1>
                    <p className="text-gray-600 text-lg">
                        A professional MERN-stack ecosystem for streamlined blood donation management.
                    </p>
                </div>

                {/* Our Purpose Section */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-1 h-8 bg-red-600"></span>
                        Our Purpose
                    </h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                        <p>
                            BloodBridge addresses the critical need for efficient blood donation management by providing 
                            a unified Single Page Application (SPA) that connects blood donors with recipients in need. 
                            The platform eliminates the fragmentation often seen in traditional blood donation systems, 
                            offering a centralized solution that streamlines the entire process from request creation to 
                            donor matching.
                        </p>
                        <p>
                            BloodBridge functions as a secure digital platform for managing blood donation requests and 
                            donor information, leveraging a high-performance MERN (MongoDB, Express.js, React, Node.js) 
                            architecture to deliver instantaneous and secure experiences. The system ensures data integrity, 
                            implements role-based access control for different user types (Admin, Volunteer, Donor), and 
                            provides comprehensive administrative tools for managing the blood donation ecosystem.
                        </p>
                        <p>
                            Our commitment extends to maintaining the highest standards of data security, user privacy, and 
                            system reliability. BloodBridge empowers communities by making blood donation more accessible, 
                            transparent, and efficient, ultimately helping to save lives through timely connections between 
                            donors and those in need.
                        </p>
                    </div>
                </div>

                {/* System Capabilities Section */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        System Capabilities
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {capabilities.map((capability, idx) => (
                            <div key={idx} className="bg-red-50 rounded-lg p-5 border border-red-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bg-red-100 p-2 rounded-lg">
                                        {capability.icon}
                                    </div>
                                    <h3 className="font-bold text-gray-900">{capability.title}</h3>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {capability.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tools & Technologies Section */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Tools & Technologies
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {technologies.map((tech, idx) => (
                            <div 
                                key={idx}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                            >
                                {tech.icon}
                                <span className="text-gray-800 font-medium">{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutPage;
