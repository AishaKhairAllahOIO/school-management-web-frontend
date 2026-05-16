import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthLayout }
from "../layouts/AuthLayout";

import { LoginPage }
from "@/features/auth/pages/LoginPage";


const router = createBrowserRouter([
  
  {
      element: <AuthLayout />,

      children: [

        {
          path: "/login",

          element: <LoginPage />,
        },
      ],
    },
  
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}