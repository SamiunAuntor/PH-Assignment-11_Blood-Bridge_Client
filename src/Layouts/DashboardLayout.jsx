import React from "react";
import { NavLink, Outlet } from "react-router";
import { Tooltip } from "react-tooltip";
import logo from "../assets/logo.png";
import { MdSpaceDashboard } from "react-icons/md";
import { HiUser, HiClipboardList, HiCog, HiLogout, HiUsers } from "react-icons/hi";
import useRole from "../Hooks/useRole";
import Loading from "../Components/Loading";

const DashboardLayout = () => {
    const { role, isLoading } = useRole();

    if (isLoading) return <Loading></Loading>;

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Sidebar */}
            <aside className="w-16 md:w-20 bg-red-600 text-white flex flex-col items-center py-4 gap-2 md:gap-4 shadow-lg">

                {/* Logo */}
                <NavLink
                    to="/"
                    className="cursor-pointer"
                    data-tooltip-id="dashTip"
                    data-tooltip-content="Home"
                >
                    <div className="text-3xl font-bold bg-white text-red-600 w-12 h-12 flex items-center justify-center rounded-full">
                        <img src={logo} alt="logo" className="w-10 h-10" />
                    </div>
                </NavLink>

                {/* Menu Icons */}
                <div className="flex flex-col gap-2 md:gap-4 mt-2">
                    {/* Dashboard Home - All Roles */}
                    <NavLink
                        to="/dashboard"
                        data-tooltip-id="dashTip"
                        data-tooltip-content="Dashboard"
                        className={({ isActive }) =>
                            `p-3 rounded-xl transition flex items-center justify-center ${isActive ? "bg-red-700 scale-105" : "hover:bg-red-700"}`
                        }
                    >
                        <MdSpaceDashboard size={26} />
                    </NavLink>

                    {/* Profile - All Roles */}
                    <NavLink
                        to="/dashboard/profile"
                        data-tooltip-id="dashTip"
                        data-tooltip-content="Profile"
                        className={({ isActive }) =>
                            `p-3 rounded-xl transition flex items-center justify-center ${isActive ? "bg-red-700 scale-105" : "hover:bg-red-700"}`
                        }
                    >
                        <HiUser size={26} />
                    </NavLink>

                    {/* Donor: My Donation Requests */}
                    {role === "donor" && (
                        <NavLink
                            to="/dashboard/my-donation-requests"
                            data-tooltip-id="dashTip"
                            data-tooltip-content="My Donation Requests"
                            className={({ isActive }) =>
                                `p-3 rounded-xl transition flex items-center justify-center ${isActive ? "bg-red-700 scale-105" : "hover:bg-red-700"}`
                            }
                        >
                            <HiClipboardList size={26} />
                        </NavLink>
                    )}

                    {/* Donor: Create Donation Request */}
                    {role === "donor" && (
                        <NavLink
                            to="/dashboard/create-donation-request"
                            data-tooltip-id="dashTip"
                            data-tooltip-content="Create Donation Request"
                            className={({ isActive }) =>
                                `p-3 rounded-xl transition flex items-center justify-center ${isActive ? "bg-red-700 scale-105" : "hover:bg-red-700"}`
                            }
                        >
                            <HiClipboardList size={26} />
                        </NavLink>
                    )}

                    {/* Admin: All Users */}
                    {role === "admin" && (
                        <NavLink
                            to="/dashboard/all-users"
                            data-tooltip-id="dashTip"
                            data-tooltip-content="All Users"
                            className={({ isActive }) =>
                                `p-3 rounded-xl transition flex items-center justify-center ${isActive ? "bg-red-700 scale-105" : "hover:bg-red-700"}`
                            }
                        >
                            <HiUsers size={26} />
                        </NavLink>
                    )}

                    {/* Admin & Volunteer: All Blood Donation Requests */}
                    {(role === "admin" || role === "volunteer") && (
                        <NavLink
                            to="/dashboard/all-blood-donation-request"
                            data-tooltip-id="dashTip"
                            data-tooltip-content="All Donation Requests"
                            className={({ isActive }) =>
                                `p-3 rounded-xl transition flex items-center justify-center ${isActive ? "bg-red-700 scale-105" : "hover:bg-red-700"}`
                            }
                        >
                            <HiClipboardList size={26} />
                        </NavLink>
                    )}

                    {/* Settings - All Roles */}
                    <NavLink
                        to="/dashboard/settings"
                        data-tooltip-id="dashTip"
                        data-tooltip-content="Settings"
                        className={({ isActive }) =>
                            `p-3 rounded-xl transition flex items-center justify-center ${isActive ? "bg-red-700 scale-105" : "hover:bg-red-700"}`
                        }
                    >
                        <HiCog size={26} />
                    </NavLink>

                    {/* Logout - All Roles */}
                    <NavLink
                        to="/logout"
                        data-tooltip-id="dashTip"
                        data-tooltip-content="Logout"
                        className="p-3 rounded-xl hover:bg-red-700 transition flex items-center justify-center"
                    >
                        <HiLogout size={26} />
                    </NavLink>
                </div>
            </aside>

            {/* Tooltip */}
            <Tooltip id="dashTip" place="right" />

            {/* Main Content */}
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
