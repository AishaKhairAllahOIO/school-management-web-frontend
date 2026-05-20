 import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import { AuthLayout } from "../layouts/AuthLayout";

import { LoginPage } from "@/features/auth/pages/LoginPage";
 
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";

import { VerifyOtpPage } from "@/features/auth/pages/VerifyOtpPage";

import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
       {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
       path: "/verify-otp",
       element: <VerifyOtpPage />,
     },
     {
       path: "/reset-password",
       element: <ResetPasswordPage />,
     },
    ],
  },

  
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
