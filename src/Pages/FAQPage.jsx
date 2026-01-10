import React, { useEffect } from "react";
import { HelpCircle, User, Heart, ShieldCheck, Search, Clock } from "lucide-react";

const FAQPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const faqs = [
        {
            category: "Getting Started",
            icon: <User className="text-red-600" size={24} />,
            questions: [
                {
                    q: "How do I register as a blood donor?",
                    a: "Click on the Register button in the navigation bar, fill in your personal details including name, email, blood group, location (district and upazila), and create a secure password. Once registered, you can start creating donation requests or respond to existing ones."
                },
                {
                    q: "Is registration free?",
                    a: "Yes, registration on BloodBridge is completely free. We are committed to providing a free platform that connects blood donors with those in need."
                },
                {
                    q: "What information do I need to provide?",
                    a: "You'll need to provide your name, email address, blood group, location (district and upazila), contact information, and optionally an avatar photo. All information is securely stored and only used for blood donation matching purposes."
                }
            ]
        },
        {
            category: "Donation Process",
            icon: <Heart className="text-red-600" size={24} />,
            questions: [
                {
                    q: "How do I create a donation request?",
                    a: "Once logged in, navigate to your dashboard and click on 'Create Donation Request'. Fill in the recipient's details, blood group required, location, hospital information, and preferred date/time. Your request will be visible to all registered donors."
                },
                {
                    q: "How long does it take to find a donor?",
                    a: "The time varies depending on the blood group required and your location. Our platform helps match you with compatible donors quickly. You can track the status of your request (pending, inprogress, done) in real-time."
                },
                {
                    q: "Can I edit or delete my donation request?",
                    a: "Yes, you can edit or delete your own donation requests at any time from your dashboard under 'My Donation Requests'. Changes will be immediately reflected on the platform."
                }
            ]
        },
        {
            category: "Search & Matching",
            icon: <Search className="text-red-600" size={24} />,
            questions: [
                {
                    q: "How do I search for donors?",
                    a: "Go to the Search Donors page, select the required blood group, district, and upazila. Click Search to find all matching donors in that location. You can also download the results as a PDF for offline reference."
                },
                {
                    q: "Can I search for donors without registering?",
                    a: "Yes, the Search Donors feature is available to all users. However, to view complete donor contact information and create donation requests, you'll need to register and log in."
                },
                {
                    q: "What blood groups can I search for?",
                    a: "You can search for any of the 8 common blood groups: A+, A-, B+, B-, AB+, AB-, O+, and O-. The search results will show all available donors matching your criteria."
                }
            ]
        },
        {
            category: "Safety & Privacy",
            icon: <ShieldCheck className="text-red-600" size={24} />,
            questions: [
                {
                    q: "Is my personal information secure?",
                    a: "Yes, we use industry-standard encryption and security measures to protect your data. All information is stored securely using Firebase Authentication and MongoDB Atlas with encrypted data storage."
                },
                {
                    q: "Who can see my contact information?",
                    a: "Your contact information is only visible to other registered users when you respond to a donation request or when someone searches for donors in your area. You can control your profile visibility through your account settings."
                },
                {
                    q: "Can I delete my account?",
                    a: "Yes, you can delete your account at any time from your profile settings. All your personal information will be permanently removed from our database in accordance with our Privacy Policy."
                }
            ]
        },
        {
            category: "General",
            icon: <HelpCircle className="text-red-600" size={24} />,
            questions: [
                {
                    q: "What is the minimum age to donate blood?",
                    a: "The standard minimum age for blood donation is 18 years old. We recommend checking with your local blood bank or medical facility for specific eligibility requirements before donating."
                },
                {
                    q: "How often can I donate blood?",
                    a: "The recommended interval between whole blood donations is typically 56 days (8 weeks). However, please consult with medical professionals for specific guidelines based on your health condition."
                },
                {
                    q: "What if I have questions or need support?",
                    a: "You can contact us through the Contact Us section on our website, or reach us via email at support@bloodbridge.example or phone at +880 122-754-6576. We're here to help with any questions or concerns."
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 pb-12">
            <div className="w-11/12 mx-auto space-y-8">
                
                {/* FAQ Header - Matching About Page */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-4xl font-bold text-red-600 mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Find answers to common questions about BloodBridge and blood donation.
                    </p>
                </div>

                {/* FAQ Sections */}
                {faqs.map((faqCategory, categoryIdx) => (
                    <div key={categoryIdx} className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <div className="bg-red-100 p-2 rounded-lg">
                                {faqCategory.icon}
                            </div>
                            {faqCategory.category}
                        </h2>
                        <div className="space-y-6">
                            {faqCategory.questions.map((faq, idx) => (
                                <div key={idx} className="border-l-4 border-red-600 pl-6 py-2">
                                    <h3 className="font-bold text-gray-900 mb-2 text-lg">
                                        {faq.q}
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Additional Help Section */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-lg">
                            <HelpCircle className="text-red-600" size={24} />
                        </div>
                        Still Have Questions?
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        If you couldn't find the answer to your question, please don't hesitate to contact us. 
                        Our support team is available to assist you with any inquiries or concerns you may have 
                        about using BloodBridge or the blood donation process.
                    </p>
                    <div className="flex items-center gap-3 text-red-600 font-semibold mt-6">
                        <Clock size={20} />
                        <span>Contact us through our support channels for immediate assistance.</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FAQPage;

