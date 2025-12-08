import React from "react";
import registerImage from "../assets/loginPhoto.jpg";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router";

const RegisterPage = () => {
    return (
        <div className="my-0 flex flex-col md:flex-row">
            {/* Left Side - Image */}
            <div className="w-full md:w-7/10 h-64 md:h-auto hidden md:block">
                <img
                    src={registerImage}
                    alt="Register"
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full md:w-3/10 flex items-center justify-center p-6 md:p-12 bg-white">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-red-600 mb-6">
                        Register
                    </h2>

                    <form className="flex flex-col gap-4">

                        {/* Email */}
                        <input
                            type="email"
                            placeholder="Email"
                            className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                        />

                        {/* Name */}
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                        />

                        {/* Avatar */}
                        <input
                            type="file"
                            className="px-4 py-3 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-300"
                        />

                        {/* Blood Group */}
                        <select
                            className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                            <option value="">Select Blood Group</option>
                            <option>A+</option><option>A-</option>
                            <option>B+</option><option>B-</option>
                            <option>AB+</option><option>AB-</option>
                            <option>O+</option><option>O-</option>
                        </select>

                        {/* District */}
                        <select
                            className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                            <option value="">Select District</option>
                        </select>

                        {/* Upazila */}
                        <select
                            className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                            <option value="">Select Upazila</option>
                        </select>

                        {/* Password */}
                        <input
                            type="password"
                            placeholder="Password"
                            className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                        />

                        {/* Confirm Password */}
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                        />

                        {/* Submit */}
                        <button
                            type="submit"
                            className="px-4 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
                        >
                            Register
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-4">
                        <hr className="flex-grow border-gray-300" />
                        <span className="mx-2 text-gray-500 text-sm">or</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>

                    {/* Continue with Google */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 border rounded-md hover:bg-red-100 transition-colors"
                        >
                            <FcGoogle size={24} />
                            Continue with Google
                        </button>
                    </div>

                    {/* Already have account */}
                    <p className="mt-4 text-center text-gray-600 text-sm">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-red-600 font-medium hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
