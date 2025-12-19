import React, { useState } from "react";
import { Link, NavLink } from "react-router";
import logo from "../assets/logo.png";
import defaultUserAvatar from "../assets/user.png";
import useAuth from "../Hooks/useAuth";
import { BiSolidDonateBlood } from "react-icons/bi";
import { FaDonate, FaHome } from "react-icons/fa";
import { Search as SearchIcon } from "lucide-react";
import { Tooltip } from "react-tooltip";

const NavBar = () => {
  const { user, logoutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `text-gray-700 bg-white p-2 rounded-md transition-colors duration-200 ${isActive ? "text-red-600 bg-red-50" : "hover:text-red-600 hover:bg-red-50"
    }`;

  return (
    <nav className="w-full bg-red-100 shadow-sm">
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
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:items-center md:gap-6">

          {/* Home */}
          <NavLink
            to="/"
            data-tooltip-id="navTip"
            data-tooltip-content="Home"
            className={navLinkClass}
          >
            <FaHome size={26} />
          </NavLink>

          {/* Donation Requests */}
          <NavLink
            to="/donation-requests"
            data-tooltip-id="navTip"
            data-tooltip-content="Donation Requests"
            className={navLinkClass}
          >
            <BiSolidDonateBlood size={28} />
          </NavLink>

          {/* Search Donors */}
          <NavLink
            to="/search"
            data-tooltip-id="navTip"
            data-tooltip-content="Search Donors"
            className={navLinkClass}
          >
            <SearchIcon size={26} />
          </NavLink>

          {/* Funding */}
          {user && (
            <NavLink
              to="/funding"
              data-tooltip-id="navTip"
              data-tooltip-content="Funding"
              className={navLinkClass}
            >
              <FaDonate size={26} />
            </NavLink>
          )}

          {/* User Menu / Auth Buttons */}
          {user ? (
            <div className="relative">
              {/* User Avatar */}
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center justify-center focus:outline-none"
              >
                <img
                  src={user.photoURL || defaultUserAvatar}
                  alt="User Avatar"
                  className="h-10 w-10 bg-white rounded-full object-cover p-0.5 border-2 border-red-500"
                />
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md border border-red-200 z-50 flex flex-col">
                  <Link
                    to="/dashboard/home"
                    className="px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { logoutUser(); setUserMenuOpen(false); }}
                    className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-b-md"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-white transition-colors duration-200 ${isActive ? "bg-red-600" : "bg-red-500 hover:bg-red-500"
                  }`
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `px-4 py-2 bg-white text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors duration-200 ${isActive ? "bg-red-50 text-red-600" : ""
                  }`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Tooltip Component */}
        <Tooltip
          id="navTip"
          place="bottom"
          className="!z-[9999]"
        />

      </div> {/* End of main nav div */}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col w-full bg-red-100 px-6 pb-4 gap-3 items-center">
          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `w-full text-center p-2 rounded-md text-gray-700 transition-colors duration-200 ${isActive ? "text-red-600 bg-red-50" : "hover:text-red-600 hover:bg-red-50"
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/donation-requests"
            className={({ isActive }) =>
              `w-full text-center p-2 rounded-md text-gray-700 transition-colors duration-200 ${isActive ? "text-red-600 bg-red-50" : "hover:text-red-600 hover:bg-red-50"
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            Donation Requests
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `w-full text-center p-2 rounded-md text-gray-700 transition-colors duration-200 ${isActive ? "text-red-600 bg-red-50" : "hover:text-red-600 hover:bg-red-50"
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            Search Donors
          </NavLink>

          {user && (
            <NavLink
              to="/funding"
              className={({ isActive }) =>
                `w-full text-center p-2 rounded-md text-gray-700 transition-colors duration-200 ${isActive ? "text-red-600 bg-red-50" : "hover:text-red-600 hover:bg-red-50"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              Funding
            </NavLink>
          )}

          {user && (
            <div className="w-full flex flex-col items-center border-t border-red-200 mt-2 pt-2">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center justify-center w-full"
              >
                <img
                  src={user.photoURL || defaultUserAvatar}
                  alt="User Avatar"
                  className="h-10 w-10 bg-white rounded-full object-cover p-0.5 border-2 border-red-500"
                />
              </button>

              {userMenuOpen && (
                <div className="w-full flex flex-col mt-2">
                  <Link
                    to="/dashboard/home"
                    className="px-4 py-2 text-gray-700 text-center hover:bg-red-50 hover:text-red-600"
                    onClick={() => { setMenuOpen(false); setUserMenuOpen(false); }}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { logoutUser(); setMenuOpen(false); setUserMenuOpen(false); }}
                    className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-b-md"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {!user && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `w-full text-center px-4 py-2 rounded-md text-white transition-colors duration-200 ${isActive ? "bg-red-500" : "bg-red-500 hover:bg-red-600"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `w-full text-center px-4 py-2 rounded-md text-red-600 border border-red-600 bg-white transition-colors duration-200 ${isActive ? "bg-red-50 text-red-600" : "hover:bg-red-50"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
