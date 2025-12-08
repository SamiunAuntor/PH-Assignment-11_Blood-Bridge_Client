import React, { useState } from "react";
import { Link, NavLink } from "react-router";
import logo from "../assets/logo.png";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-red-100 shadow-md">
      <div className="w-11/12 mx-auto flex justify-between items-center py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="BloodBridge Logo" className="h-10 w-10 rounded-full" />
          <span className="text-2xl font-bold text-red-600">BloodBridge</span>
        </Link>

        {/* Hamburger Button (mobile) */}
        <button
          className="md:hidden text-red-600 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex md:items-center md:gap-6">
          <NavLink
            to="/donation-requests"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md font-bold transition-colors duration-200 ${isActive ? "bg-red-50 text-red-600 font-semibold" : "text-gray-700 hover:bg-red-50 hover:text-red-600"
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col w-full bg-red-100 px-6 pb-4 gap-3 items-center">
          <NavLink
            to="/donation-requests"
            className={({ isActive }) =>
              `w-full text-center px-3 py-2 rounded-md font-bold transition-colors duration-200 ${isActive ? "bg-red-50 text-red-600 font-semibold" : "text-gray-700 hover:bg-red-50 hover:text-red-600"
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            Donation Requests
          </NavLink>

          <NavLink
            to="/login"
            className="w-full text-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </NavLink>

          <NavLink
            to="/register"
            className="w-full text-center px-4 py-2 bg-white text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Register
          </NavLink>
        </div>
      )}

    </nav>
  );
};

export default NavBar;
