import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";
import Loading from "../Components/Loading";

const AdminPages = ({ children }) => {
    const { user, loading, logoutUser } = useAuth();
    const { role, isLoading } = useRole();
    const navigate = useNavigate();

    useEffect(() => {
        // Not logged in → login
        if (!loading && !user) {
            navigate("/login", { replace: true });
            return;
        }

        // Check if user has admin role - unauthorized access detected
        if (!isLoading && user && role && role !== "admin") {
            // Log out and redirect to login
            const handleUnauthorized = async () => {
                try {
                    await logoutUser();
                    navigate("/login", { replace: true });
                } catch (err) {
                    console.error("Logout error:", err);
                    navigate("/login", { replace: true });
                }
            };
            handleUnauthorized();
        }
    }, [user, loading, role, isLoading, navigate, logoutUser]);

    if (loading || isLoading) return <Loading />;
    if (!user) return null;

    // Only render children if user is admin
    if (role !== "admin") return null;

    return <>{children}</>;
};

export default AdminPages;