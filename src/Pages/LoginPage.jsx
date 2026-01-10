import React, { useEffect, useState } from "react";
import loginImage from "../assets/loginPhoto.jpg";
import { Link, useNavigate } from "react-router";
import useAuth from "../Hooks/useAuth";
import { useForm } from "react-hook-form";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { ShieldCheck, Users, User as UserIcon } from "lucide-react";
import { showToast } from "../Utilities/ToastMessage";
import Loading from "../Components/Loading";


const LoginPage = () => {
    const { loginUserWithEmailPassword, user, loading } = useAuth();
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [quickLoginLoading, setQuickLoginLoading] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();


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

            // Reset loading state before navigation
            setQuickLoginLoading(false);
            navigate("/"); // redirect to home page after login
        } catch (err) {
            showToast(getFriendlyErrorMessage(err), "error");
            setQuickLoginLoading(false);
        }
    };

    const handleQuickLogin = async (email, password, role) => {
        try {
            setQuickLoginLoading(true);
            
            // Auto-fill the form fields with proper options for visual update
            setValue("email", email, { shouldValidate: true, shouldDirty: true });
            setValue("password", password, { shouldValidate: true, shouldDirty: true });
            
            // Small delay to show form being filled (visual feedback)
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Auto-submit the form by calling onSubmit with the credentials
            await onSubmit({ email, password });
        } catch (err) {
            showToast(getFriendlyErrorMessage(err), "error");
            setQuickLoginLoading(false);
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

                    {/* Quick Login Section */}
                    <div className="mb-6 p-4 border border-dashed border-green-500 rounded-lg bg-green-50">
                        <p className="text-xs font-bold text-green-700 uppercase mb-3 text-center tracking-wider">
                            Quick Login
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => handleQuickLogin("admin2@gmail.com", "admin2", "Admin")}
                                disabled={isSubmitting || quickLoginLoading}
                                className="flex items-center justify-center gap-2 bg-gray-900 text-white py-2 px-3 text-xs font-semibold rounded hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShieldCheck size={14} /> Admin
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickLogin("volunteer@gmail.com", "volunteer", "Volunteer")}
                                disabled={isSubmitting || quickLoginLoading}
                                className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-3 text-xs font-semibold rounded hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Users size={14} /> Volunteer
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickLogin("user101@gmail.com", "user123", "User")}
                                disabled={isSubmitting || quickLoginLoading}
                                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-3 text-xs font-semibold rounded hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <UserIcon size={14} /> User
                            </button>
                        </div>
                    </div>

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
                            disabled={isSubmitting || quickLoginLoading}
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
