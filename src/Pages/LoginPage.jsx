import React, { useState } from "react";
import loginImage from "../assets/loginPhoto.jpg";
import { Link, useNavigate } from "react-router";
import useAuth from "../Hooks/useAuth";
import toast, { Toaster } from "react-hot-toast";

const LoginPage = () => {
    const { loginUserWithEmailPassword } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await loginUserWithEmailPassword(email, password);
            toast.success("Login successful!");
            navigate("/"); // Redirect to dashboard
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-5 mb-20 flex flex-col md:flex-row min-h-screen">
            <Toaster position="top-right" reverseOrder={false} />

            {/* Left Side - Image */}
            <div className="w-full md:w-7/10 h-64 md:h-auto hidden md:block">
                <img
                    src={loginImage}
                    alt="Login"
                    className="w-full h-full object-cover rounded-l-lg"
                />
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-3/10 flex items-center justify-center p-6 md:p-12 bg-white rounded-r-lg shadow-lg">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-red-600 mb-6">Login</h2>

                    <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Logging in..." : "Login"}
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

                    {/* Register link */}
                    <p className="mt-4 text-center text-gray-600 text-sm">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-red-600 font-medium hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
