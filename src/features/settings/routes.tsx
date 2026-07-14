import { Navigate } from "react-router-dom";

import { AcademicSettingsPage } from "@/features/settings/academic/pages/AcademicSettingsPage";
import { GeneralSettingsPage } from "@/features/settings/general/pages/GeneralSettingsPage";
import { PermissionsPage } from "@/features/settings/permissions/pages/PermissionsPage";
import { RolesPage } from "@/features/settings/roles/pages/RolesPage";

export const settingsRoutes = {
  path: "settings",

  children: [
    {
      index: true,

      element: (
        <Navigate
          to="general"
          replace
        />
      ),
    },

    {
      path: "general",
      element: <GeneralSettingsPage />,
    },

    {
      path: "academic",
      element: <AcademicSettingsPage />,
    },

    {
      path: "roles",
      element: <RolesPage />,
    },

    {
      path: "permissions",
      element: <PermissionsPage />,
    },
  ],
};