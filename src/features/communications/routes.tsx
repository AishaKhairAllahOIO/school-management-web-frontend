import { Navigate } from "react-router-dom";

import { AnnouncementsPage } from "@/features/communications/announcements/pages/AnnouncementsPage";

export const communicationsRoutes = {
  path: "communications",
  children: [
    { index: true, element: <Navigate to="announcements" replace /> },
    { path: "announcements", element: <AnnouncementsPage /> },
  ],
};
