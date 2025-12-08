import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { HiMail, HiPhone } from "react-icons/hi";
import { Link } from "react-router";
import logo from "../assets/logo.png";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-red-100 text-gray-800 shadow-xl mt-12">
            <div className="w-11/12 mx-auto py-10">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">

                    {/* LEFT - LOGO */}
                    <div className="flex-1">
                        <Link to="/" className="inline-flex items-center gap-3">
                            <img src={logo} alt="BloodBridge Logo" className="h-12 w-12 rounded-full object-cover" />
                            <span className="text-2xl font-extrabold text-red-600">BloodBridge</span>
                        </Link>

                        <p className="mt-4 text-gray-600 leading-relaxed">
                            Connecting donors with those in urgent need.
                            Join our mission and help save lives.
                        </p>

                        {/* Social Icons */}
                        <div className="mt-5 flex items-center gap-3">
                            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="p-2 bg-red-200 rounded-full hover:bg-red-300 transition"
                                >
                                    <Icon className="text-red-700" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* MIDDLE LINKS */}
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-3 text-red-700">Useful Links</h3>
                        <ul className="space-y-2 text-gray-700">
                            <li><Link to="/" className="hover:text-red-600 transition">Home</Link></li>
                            <li><Link to="/donation-requests" className="hover:text-red-600 transition">Donation Requests</Link></li>
                            <li><Link to="/funding-links" className="hover:text-red-600 transition">Funding</Link></li>
                            <li><Link to="/search" className="hover:text-red-600 transition">Search Donors</Link></li>
                        </ul>
                    </div>

                    {/* RIGHT CONTACT */}
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-3 text-red-700">Contact</h3>

                        <div className="flex items-start gap-3">
                            <HiPhone className="text-2xl text-red-700" />
                            <div>
                                <p className="font-medium">Phone</p>
                                <p className="text-gray-600 text-sm">+880 1XX-XXX-XXXX</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 mt-4">
                            <HiMail className="text-2xl text-red-700" />
                            <div>
                                <p className="font-medium">Email</p>
                                <p className="text-gray-600 text-sm">support@bloodbridge.example</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-red-300"></div>

            {/* COPYRIGHT */}
            <div className="py-4 text-center text-gray-600 text-sm">
                © {year} BloodBridge — All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;
