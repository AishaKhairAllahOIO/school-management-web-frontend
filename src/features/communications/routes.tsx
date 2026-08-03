import {
  lazy,
  Suspense,
} from "react";
import type {
  RouteObject,
} from "react-router-dom";
import {
  Navigate,
} from "react-router-dom";

const CommunicationsPage = lazy(() =>
  import(
    "@/features/communications/pages/CommunicationsPage"
  ).then((module) => ({
    default: module.CommunicationsPage,
  })),
);

function PageFallback() {
  return (
    <div className="-mt-1 space-y-4">
      <div className="h-[92px] animate-pulse rounded-[22px] border border-border/60 bg-card" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[220px] animate-pulse rounded-[20px] border border-border/60 bg-card"
          />
        ))}
      </div>
    </div>
  );
}

function CommunicationRoute() {
  return (
    <Suspense fallback={<PageFallback />}>
      <CommunicationsPage />
    </Suspense>
  );
}

export const communicationsRoutes = [
  {
    path: "communications",
    children: [
      {
        index: true,
        element: (
          <Navigate
            to="announcements"
            replace
          />
        ),
      },
      {
        path: "announcements",
        element: <CommunicationRoute />,
      },
      {
        path: "alerts",
        element: <CommunicationRoute />,
      },
      {
        path: "activities",
        element: <CommunicationRoute />,
      },
      {
        path: "laws",
        element: <CommunicationRoute />,
      },
    ],
  },
] satisfies RouteObject[];
