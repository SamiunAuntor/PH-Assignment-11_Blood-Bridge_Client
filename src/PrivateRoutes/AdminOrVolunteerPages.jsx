import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";
import Loading from "../Components/Loading";

const AdminOrVolunteerPages = ({ children }) => {
    const { user, loading, logoutUser } = useAuth();
    const { role, isLoading } = useRole();
    const navigate = useNavigate();

    useEffect(() => {
        // Not logged in -> login
        if (!loading && !user) {
            navigate("/login", { replace: true });
            return;
        }

        // Check if user has admin or volunteer role - unauthorized access detected
        if (!isLoading && user && role && role !== "admin" && role !== "volunteer") {
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

    // Only render children if user is admin or volunteer
    if (role !== "admin" && role !== "volunteer") return null;

    return <>{children}</>;
};

export default AdminOrVolunteerPages;

