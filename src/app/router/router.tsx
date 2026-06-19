import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/app/layouts/app/AppLayout";
import { ErrorPage, NotFoundPage } from "@/app/pages";
import { appRoutes } from "./routes";
import { AuthLayout } from "../layouts/auth/AuthLayout";

export const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      ...appRoutes,
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);