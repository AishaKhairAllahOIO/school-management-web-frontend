import { createBrowserRouter } from "react-router-dom";

import { AppLayout  } from "@/app/layouts/app/AppLayout";
import { ErrorPage, NotFoundPage } from "@/app/pages";
import { LoginPage } from "@/features/auth/pages/LoginPage";

import { appRoutes } from "./routes";

export const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <AppLayout  />,
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