import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";


const CommunicationsPage = lazy(() =>
  import("@/features/communications/pages/CommunicationsPage").then((module) => ({
    default: module.CommunicationsPage,
  }))
);


const PageFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh] w-full text-primary">
    <Loader2 className="w-8 h-8 animate-spin" />
  </div>
);


export const communicationsRoutes = [
  {
    path: "communications",
    children: [

      {
        index: true,
        element: <Navigate to="announcements" replace />,
      },

      {
        path: "announcements",
        element: (
          <Suspense fallback={<PageFallback />}>
            <CommunicationsPage />
          </Suspense>
        ),
      },

      {
        path: "activities",
        element: (
          <Suspense fallback={<PageFallback />}>
            <CommunicationsPage />
          </Suspense>
        ),
      },
      {
        path: "laws",
        element: (
          <Suspense fallback={<PageFallback />}>
            <CommunicationsPage />
          </Suspense>
        ),
      },
    ],
  },
] satisfies RouteObject[];