import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { Tooltip } from "react-tooltip";
import logo from "../assets/logo.png";
import { MdSpaceDashboard } from "react-icons/md";
import { HiUser, HiClipboardList, HiLogout, HiUsers } from "react-icons/hi";
import { IoMdCreate } from "react-icons/io";
import useRole from "../Hooks/useRole";
import Loading from "../Components/Loading";
import useAuth from "../Hooks/useAuth";

const DashboardLayout = () => {
    const { role, isLoading } = useRole();
    const { user, loading, logoutUser } = useAuth();
    const navigate = useNavigate();

    // Role hierarchy
    const isDonor = role === "donor" || role === "volunteer" || role === "admin";
    const isVolunteer = role === "volunteer" || role === "admin";
    const isAdmin = role === "admin";

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login", { replace: true });
        }
    }, [user, loading, navigate]);

    if (loading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Sidebar */}
            <aside className="w-16 md:w-20 bg-red-600 text-white flex flex-col items-center py-4 gap-4 shadow-lg">

                {/* Logo */}
                <NavLink to="/" data-tooltip-id="dashTip" data-tooltip-content="Home">
                    <div className="bg-white text-red-600 w-12 h-12 rounded-full flex items-center justify-center">
                        <img src={logo} alt="logo" className="w-10 h-10" />
                    </div>
                </NavLink>

                {/* Menu */}
                <div className="flex flex-col gap-4 mt-4">

                    {/* Dashboard */}
                    <NavLink
                        to="/dashboard/home"
                        data-tooltip-id="dashTip"
                        data-tooltip-content="Dashboard"
                        className={({ isActive }) =>
                            `p-3 rounded-xl ${isActive ? "bg-red-700 scale-105" : "hover:bg-red-700"}`
                        }
                    >
                        <MdSpaceDashboard size={26} />
                    </NavLink>

                    {/* Profile */}
                    <NavLink
                        to="/dashboard/profile"
                        data-tooltip-id="dashTip"
                        data-tooltip-content="Profile"
                        className={({ isActive }) =>
                            `p-3 rounded-xl ${isActive ? "bg-red-700 scale-105" : "hover:bg-red-700"}`
                        }
                    >
                        <HiUser size={26} />
                    </NavLink>

                    {/* Donor Features (Donor + Volunteer + Admin) */}
                    {isDonor && (
                        <>
                            <NavLink
                                to="/dashboard/my-donation-requests"
                                data-tooltip-id="dashTip"
                                data-tooltip-content="My Donation Requests"
                                className={({ isActive }) =>
                                    `p-3 rounded-xl ${isActive ? "bg-red-700 scale-105" : "hover:bg-red-700"}`
                                }
                            >
                                <HiClipboardList size={26} />
                            </NavLink>

                            <NavLink
                                to="/dashboard/create-donation-request"
                                data-tooltip-id="dashTip"
                                data-tooltip-content="Create Donation Request"
                                className={({ isActive }) =>
                                    `p-3 rounded-xl ${isActive ? "bg-red-700 scale-105" : "hover:bg-red-700"}`
                                }
                            >
                                <IoMdCreate size={26} />
                            </NavLink>
                        </>
                    )}

                    {/* Volunteer + Admin */}
                    {isVolunteer && (
                        <NavLink
                            to="/dashboard/all-blood-donation-request"
                            data-tooltip-id="dashTip"
                            data-tooltip-content="All Donation Requests"
                            className={({ isActive }) =>
                                `p-3 rounded-xl ${isActive ? "bg-red-700 scale-105" : "hover:bg-red-700"}`
                            }
                        >
                            <HiClipboardList size={26} />
                        </NavLink>
                    )}

                    {/* Admin only */}
                    {isAdmin && (
                        <NavLink
                            to="/dashboard/all-users"
                            data-tooltip-id="dashTip"
                            data-tooltip-content="All Users"
                            className={({ isActive }) =>
                                `p-3 rounded-xl ${isActive ? "bg-red-700 scale-105" : "hover:bg-red-700"}`
                            }
                        >
                            <HiUsers size={26} />
                        </NavLink>
                    )}

                    {/* Logout */}
                    <button
                        onClick={async () => {
                            await logoutUser();
                            navigate("/login");
                        }}
                        data-tooltip-id="dashTip"
                        data-tooltip-content="Logout"
                        className="p-3 rounded-xl hover:bg-red-700"
                    >
                        <HiLogout size={26} />
                    </button>

                </div>
            </aside>

            <Tooltip
                id="dashTip"
                place="right"
                effect="solid"
                portal={true}
                className="!z-[9999]"
            />


            {/* Content */}
            <main className="flex-1 p-6 overflow-x-auto">
                <div>
                    <Outlet />
                </div>

            </main>
        </div>
    );
};

export default DashboardLayout;
