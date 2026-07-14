import { Navigate, type RouteObject } from "react-router-dom";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { LoginPage } from "../pages/LoginPage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { VerifyOtpPage } from "../pages/VerifyOtpPage";

export const authRoutes: RouteObject[] =
[
  { index: true, element: <Navigate to="login" replace /> },
  { path: "login", element: <LoginPage /> },
  { path: "verify-otp", element: <VerifyOtpPage /> },
  { path: "forgot-password", element: <ForgotPasswordPage /> },
  { path: "reset-password", element: <ResetPasswordPage /> },
];
