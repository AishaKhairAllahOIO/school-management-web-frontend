import { Navigate } from "react-router-dom";

import { AnnouncementsPage } from "@/features/communications/announcements/pages/AnnouncementsPage";
import { NotificationsPage } from "@/features/communications/notifications/pages/NotificationsPage";
import { MessagesPage } from "@/features/communications/messages/pages/MessagesPage";
import { ComplaintsPage } from "@/features/communications/complaints/pages/ComplaintsPage";

export const communicationsRoutes = {
  path: "communication",
  children: [
    {
      index: true,
      element: <Navigate to="announcements" replace />,
    },
    {
      path: "announcements",
      element: <AnnouncementsPage />,
    },
    {
      path: "notifications",
      element: <NotificationsPage />,
    },
    {
      path: "messages",
      element: <MessagesPage />,
    },
    {
      path: "complaints",
      element: <ComplaintsPage />,
    },
  ],
};
