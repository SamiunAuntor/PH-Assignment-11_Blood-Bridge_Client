import React, { useEffect } from "react";
import {
    ShieldCheck,
    Database,
    Zap,
    Users,
    Lock,
    UserCheck,
    Globe,
    FileText,
    Server
} from "lucide-react";

const PrivacyPolicyPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const securityFeatures = [
        {
            icon: <Database className="text-red-600" size={24} />,
            title: "Firebase Verification",
            description: "Secure authentication and user verification through Firebase."
        },
        {
            icon: <Database className="text-red-600" size={24} />,
            title: "MongoDB Atlas",
            description: "Protected database with encrypted data storage and backups."
        },
        {
            icon: <Zap className="text-red-600" size={24} />,
            title: "API Security",
            description: "Secure API endpoints with JWT token authentication."
        },
        {
            icon: <Users className="text-red-600" size={24} />,
            title: "Admin Controls",
            description: "Role-based access control for Admin, Volunteer, and Donor roles."
        },
        {
            icon: <Lock className="text-red-600" size={24} />,
            title: "Zero-Knowledge Auth",
            description: "Advanced authentication protocols ensuring user privacy."
        },
        {
            icon: <Server className="text-red-600" size={24} />,
            title: "Data Encryption",
            description: "All sensitive data is encrypted both in transit and at rest."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 pb-12">
            <div className="w-11/12 mx-auto space-y-8">
                
                {/* Privacy Policy Header - Matching About Page */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-4xl font-bold text-red-600 mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Our commitment to protecting your blood donation data and personal privacy.
                    </p>
                </div>

                {/* Security Infrastructure Section - Simple White Card */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-1 h-8 bg-red-600"></span>
                        Security Infrastructure
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {securityFeatures.map((feature, idx) => (
                            <div key={idx} className="bg-red-50 rounded-lg p-5 border border-red-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bg-red-100 p-2 rounded-lg">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-bold text-gray-900">{feature.title}</h3>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Identity Protection Section */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-1 h-8 bg-red-600"></span>
                        Identity Protection
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        We prioritize the protection of your personal identity and contact information. 
                        Your personal details are securely stored and only accessible to authorized personnel 
                        for blood donation matching purposes. We never share your information with third parties 
                        without your explicit consent.
                    </p>
                </div>

                {/* Data Collection Section */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-1 h-8 bg-red-600"></span>
                        Data Collection
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        We collect only the essential information required for blood donation management, 
                        including your name, email, blood group, location, and contact details. All data 
                        collection follows strict privacy guidelines and is used solely for connecting donors 
                        with recipients in need. We do not collect any unnecessary personal or financial information.
                    </p>
                </div>

                {/* Your Rights Section */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-1 h-8 bg-red-600"></span>
                        Your Rights
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        You have the right to access, update, or delete your personal information at any time 
                        through your profile settings. You can opt-out of receiving notifications or remove your 
                        donor profile whenever you choose. We respect your privacy decisions and ensure full 
                        transparency regarding how your data is used.
                    </p>
                </div>

                {/* Additional Information Section */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-1 h-8 bg-red-600"></span>
                        Additional Information
                    </h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                        <p>
                            BloodBridge is committed to maintaining the highest standards of data protection and privacy. 
                            Our platform uses industry-standard encryption methods to safeguard all user information. 
                            Regular security audits and updates ensure that your data remains protected against emerging threats.
                        </p>
                        <p>
                            If you have any questions or concerns about our Privacy Policy or how we handle your personal 
                            information, please contact us through our support channels. We are dedicated to addressing 
                            any privacy-related inquiries promptly and transparently.
                        </p>
                        <p className="text-sm text-gray-600 pt-4 border-t border-gray-200">
                            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
