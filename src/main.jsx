import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./Router";
import AuthProvider from "./Firebase/AuthProvider";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
    </AuthProvider>
  </StrictMode>
);
