import { createBrowserRouter } from "react-router-dom";

import { DashboardLayout  } from "@/app/layouts/dashboard";
import { appRoutes } from "@/app/router/routes";
import { ErrorPage, NotFoundPage } from "@/app/pages";

export const router = createBrowserRouter([
  {
    element: <DashboardLayout  />,
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