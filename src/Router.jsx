import { createBrowserRouter, Navigate } from "react-router";
import HomeLayout from "./Layouts/HomeLayout";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import Error404Page from "./Pages/Error404Page";
import AboutPage from "./Pages/AboutPage";
import DashboardLayout from "./Layouts/DashboardLayout";
import CreateDonationRequest from "./Pages/CreateDonationRequest";
import UserProfile from "./Pages/UserProfile";
import DashboardHome from "./Pages/DashboardHome";
import MyAllDonationRequests from "./Pages/MyAllDonationRequests";
import AllUsers from "./Pages/AllUsers";
import AllBloodDonationRequest from "./Pages/AllBloodDonationRequest";
import EditDonationRequest from "./Pages/EditDonationRequest";
import SearchDonors from "./Pages/SearchDonors";
import DonationRequests from "./Pages/DonationRequests";
import DonationRequestDetails from "./Pages/DonationRequestDetails";
import Funding from "./Pages/Funding";
import DonorPages from "./PrivateRoutes/DonorPages";
import AdminPages from "./PrivateRoutes/AdminPages";
import AdminOrVolunteerPages from "./PrivateRoutes/AdminOrVolunteerPages";
import ProtectedRoute from "./PrivateRoutes/ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout></HomeLayout>,
        children: [
            {
                index: true,
                element: <HomePage></HomePage>,
            },
            {
                path: "login",
                element: <LoginPage></LoginPage>,
            },
            {
                path: "register",
                element: <RegisterPage></RegisterPage>,
            },
            {
                path: "search",
                element: <SearchDonors></SearchDonors>,
            },
            {
                path: "donation-requests",
                element: <DonationRequests></DonationRequests>,
            },
            {
                path: "donation-request/:id",
                element: <ProtectedRoute><DonationRequestDetails></DonationRequestDetails></ProtectedRoute>,
            },
            {
                path: "funding",
                element: <Funding></Funding>,
            },
            {
                path: "about",
                element: <AboutPage></AboutPage>,
            }
        ]

    },
    {
        path: "/dashboard",
        element: <DashboardLayout></DashboardLayout>,
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard/home" replace />
            },
            {
                path: "home",
                element: <ProtectedRoute><DashboardHome></DashboardHome></ProtectedRoute>
            },
            {
                path: "profile",
                element: <ProtectedRoute><UserProfile></UserProfile></ProtectedRoute>
            },
            {
                path: "create-donation-request",
                element: <DonorPages><CreateDonationRequest></CreateDonationRequest></DonorPages>
            },
            {
                path: "my-donation-requests",
                element: <DonorPages><MyAllDonationRequests></MyAllDonationRequests></DonorPages>
            },
            {
                path: "all-users",
                element: <AdminPages><AllUsers></AllUsers></AdminPages>
            },
            {
                path: "all-blood-donation-request",
                element: <AdminOrVolunteerPages><AllBloodDonationRequest></AllBloodDonationRequest></AdminOrVolunteerPages>
            },
            {
                path: "edit-donation-request/:id",
                element: <DonorPages><EditDonationRequest></EditDonationRequest></DonorPages>
            },
            {
                path: "donation-request/:id",
                element: <ProtectedRoute><DonationRequestDetails></DonationRequestDetails></ProtectedRoute>
            }
        ]
    },
    {
        path: "*",
        element: <Error404Page></Error404Page>
    }
])

export default router;