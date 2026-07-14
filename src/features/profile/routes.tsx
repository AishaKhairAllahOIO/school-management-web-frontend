import type { RouteObject } from "react-router-dom";

import { ProfilePage } from "@/features/profile/pages/ProfilePage";

export const profileRoutes = [
  {
    path: "profile",
    element: <ProfilePage />,
  },
] satisfies RouteObject[];