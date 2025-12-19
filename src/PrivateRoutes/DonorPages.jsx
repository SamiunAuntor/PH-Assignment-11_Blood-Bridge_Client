import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";
import Loading from "../Components/Loading";

const DonorPages = ({ children }) => {
    const { user, loading, logoutUser } = useAuth();
    const { role, isLoading } = useRole();
    const navigate = useNavigate();

    useEffect(() => {
        // Not logged in -> login
        if (!loading && !user) {
            navigate("/login", { replace: true });
            return;
        }

        // I used this role hierarchy :
        // donor     = donor
        // volunteer = donor + volunteer
        // admin     = donor + volunteer + admin
        // So donor features should be available to donor, volunteer and admin.
        const allowedRoles = ["donor", "volunteer", "admin"];

        // Unauthorized access -> logout and redirect
        if (!isLoading && user && role && !allowedRoles.includes(role)) {
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

    if (loading || isLoading) return <div className="min-h-screen flex items-center justify-center ">
        <Loading />
    </div>;
    if (!user) return null;

    // Only render children if user has at least donor-level access
    if (!["donor", "volunteer", "admin"].includes(role)) return null;

    return <>{children}</>;
};

export default DonorPages;
