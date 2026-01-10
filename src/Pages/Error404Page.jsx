import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import errorImage from "../assets/404.jpg";

const Error404Page = () => {
    const navigate = useNavigate();

    // Ensure we are on top after redirected to this page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="flex flex-col items-center min-h-screen">

            {/* Top Image */}
            <div className="h-[40vh] md:h-[70vh]">
                <img
                    src={errorImage}
                    alt="404 Error"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Text and Buttons */}
            <div className="flex flex-col items-center mt-6 space-y-4 px-6 md:px-0">
                <h1 className="text-5xl font-extrabold text-red-600">Oops!</h1>
                <p className="text-gray-700 text-center text-lg md:text-xl">
                    The page you’re looking for does not exist.
                </p>

                <div className="flex gap-4 mt-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-red-100 text-red-700 font-semibold rounded-md hover:bg-red-200 transition"
                    >
                        Go Back
                    </button>

                    <Link
                        to="/"
                        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
                    >
                        Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Error404Page;
