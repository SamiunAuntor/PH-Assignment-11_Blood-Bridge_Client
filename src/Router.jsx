import { createBrowserRouter } from "react-router";
import HomeLayout from "./Layouts/HomeLayout";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import Error404Page from "./Pages/Error404Page";
import DashboardLayout from "./Layouts/DashboardLayout";
import CreateDonationRequest from "./Pages/CreateDonationRequest";

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
            }
        ]

    },
    {
        path: "/dashboard",
        element: <DashboardLayout></DashboardLayout>,
        children: [
            {
                path: "create-donation-request",
                element: <CreateDonationRequest></CreateDonationRequest>
            }
        ]
    },
    {
        path: "*",
        element: <Error404Page></Error404Page>
    }
])

export default router;