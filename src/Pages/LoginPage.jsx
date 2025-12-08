import React from "react";
import loginImage from "../assets/login-register-photo.jpg";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router"; 

const LoginPage = () => {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Side - Image */}
            <div className="w-full md:w-7/10 h-64 md:h-auto">
                <img
                    src={loginImage}
                    alt="Login"
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-3/10 flex items-center justify-center p-6 md:p-12 bg-white">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-red-600 mb-6 text-center md:text-left">
                        Login
                    </h2>

                    <form className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Email"
                            className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                        />

                        <button
                            type="submit"
                            className="px-4 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
                        >
                            Login
                        </button>
                    </form>

                    {/* Forgot password */}
                    <div className="text-center md:text-right mt-2">
                        <Link
                            to="/forgot-password"
                            className="text-red-600 hover:underline text-sm"
                        >
                            Forgot Password?
                        </Link>
                    </div>

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
                            className="flex items-center justify-center gap-2 px-4 py-3 border rounded-md hover:bg-red-100 transition-colors"
                        >
                            <FcGoogle size={24} />
                            Continue with Google
                        </button>
                    </div>

                    {/* Sign up */}
                    <p className="mt-4 text-center text-gray-600 text-sm">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-red-600 font-medium hover:underline"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
