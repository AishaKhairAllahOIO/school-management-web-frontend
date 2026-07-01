import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/app/layouts/app/AppLayout";
import { ErrorPage, NotFoundPage } from "@/app/pages";
import { appRoutes } from "./routes";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { GuestGuard } from "@/features/auth/components/GuestGuard";
import { authRoutes } from "@/features/auth/routes/auth.routes";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <GuestGuard />,
    errorElement: <ErrorPage />,
    children: authRoutes,
  },
  {
    path: "/",
    element: <AuthGuard />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <AppLayout />,
        children: [
          ...appRoutes,
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
