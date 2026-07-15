import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/app/layouts/AppLayout";
import { ErrorPage, NotFoundPage } from "@/app/pages";
import { AuthGuard } from "@/features/auth/guards/AuthGuard";
import { GuestGuard } from "@/features/auth/guards/GuestGuard";
import { authRoutes } from "@/features/auth/routes";

import { appRoutes } from "./routes";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <GuestGuard />,
    errorElement: <ErrorPage />,
    children: [
      ...authRoutes,
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
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
          {
            path: "*",
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
]);