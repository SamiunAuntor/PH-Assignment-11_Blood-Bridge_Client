import React, { useEffect, useState } from "react";
import loginImage from "../assets/loginPhoto.jpg";
import { Link, useNavigate } from "react-router";
import useAuth from "../Hooks/useAuth";
import { useForm } from "react-hook-form";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { showToast } from "../Utilities/ToastMessage";
import Loading from "../Components/Loading";


const LoginPage = () => {
    const { loginUserWithEmailPassword, user, loading } = useAuth();
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();


    // State to manage minimum loading time
    const [pageLoading, setPageLoading] = useState(true);

    // Ensure loading spinner shows for at least 0.5 seconds
    useEffect(() => {
        const timer = setTimeout(() => setPageLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    // Ensure we are on top after redirected to loginn page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Show loading spinner only for initial page load
    if (pageLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <Loading />
            </div>
        );
    }






    const getFriendlyErrorMessage = (error) => {
        if (!error || !error.code) return "Something went wrong. Please try again.";
        switch (error.code) {
            case "auth/invalid-credential": return "Invalid credentials. Please try again.";
            default: return error.message || "Login failed. Please try again.";
        }
    };

    const onSubmit = async (data) => {
        try {
            await loginUserWithEmailPassword(data.email, data.password);

            // Show toast with user's displayName
            const name = user?.displayName || data.email.split("@")[0];
            showToast(`Welcome back, ${name}!`, "success");

            navigate("/"); // redirect to home page after login
        } catch (err) {
            showToast(getFriendlyErrorMessage(err), "error");
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <div className="w-full md:w-[65%] lg:w-[70%] h-64 md:h-auto hidden md:block">
                <img src={loginImage} alt="Login" className="w-full h-full object-contain" />
            </div>

            <div className="w-full md:w-[35%] lg:w-[30%] flex items-center justify-center p-6 md:p-12 bg-white">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-red-600 mb-6">Login</h2>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                {...register("email", { required: "Email is required" })}
                                className={`w-full px-4 py-3 border-2 rounded-md outline-none text-gray-700 ${errors.email ? "border-red-500 focus:border-red-500" : "border-red-300 focus:border-red-500"}`}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="relative">
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="Password"
                                {...register("password", { required: "Password is required" })}
                                className={`w-full px-4 py-3 border-2 rounded-md outline-none text-gray-700 ${errors.password ? "border-red-500 focus:border-red-500" : "border-red-300 focus:border-red-500"}`}
                            />
                            <span
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                            >
                                {showPass ? <HiEyeOff size={22} /> : <HiEye size={22} />}
                            </span>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="mt-4 text-center text-gray-600 text-sm">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-red-600 font-medium hover:underline">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
