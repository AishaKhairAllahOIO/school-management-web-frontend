import type { RouteObject } from "react-router-dom";

import { ManageContentPage } from "./pages/ManageContentPage";

export const contentRoutes = [
  {
    path: "/manage-content",
    element: <ManageContentPage />,
  },
] satisfies RouteObject[];