import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "../Hooks/useAuth";
import Loading from "../Components/Loading";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Not logged in → login
        if (!loading && !user) {
            navigate("/login", { replace: true });
        }
    }, [user, loading, navigate]);

    if (loading) return <div className="min-h-screen flex items-center justify-center ">
        <Loading />
    </div>;
    if (!user) return null;

    return <>{children}</>;
};

export default ProtectedRoute;

