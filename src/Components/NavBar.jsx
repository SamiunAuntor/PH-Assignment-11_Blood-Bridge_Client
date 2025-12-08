import React from "react";
import { Link, NavLink } from "react-router"; 
import logo from "../assets/logo.png"; 

const NavBar = () => {
  return (
    <nav className="w-full bg-red-100 shadow-md">
      <div className="w-11/12 mx-auto flex justify-between items-center py-3">
        {/* Left: Logo + Title */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="BloodBridge Logo" className="h-10 w-10 rounded-full" />
          <span className="text-2xl font-bold text-red-600">BloodBridge</span>
        </Link>

        {/* Right: Links */}
        <div className="flex items-center gap-6">
          <NavLink
            to="/donation-requests"
            className={({ isActive }) =>
              `px-3 font-bold bg-red-200 py-2 rounded-md transition-colors duration-200 ${
                isActive ? "bg-red-50 text-red-600 font-semibold" : "text-gray-700 hover:bg-red-50 hover:text-red-600"
              }`
            }
          >
            Donation Requests
          </NavLink>

          <NavLink
            to="/login"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Login
          </NavLink>

          <NavLink
            to="/register"
            className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors duration-200"
          >
            Register
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
