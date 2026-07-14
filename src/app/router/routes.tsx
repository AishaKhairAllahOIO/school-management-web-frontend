import type { RouteObject } from "react-router-dom";

import { academicsRoutes } from "@/features/academics/routes";
import { attendanceRoutes } from "@/features/attendance/routes";
import { communicationsRoutes } from "@/features/communications/routes";
import { dashboardRoutes } from "@/features/dashboard/routes";
import { financeRoutes } from "@/features/finance/routes";
import { profileRoutes } from "@/features/profile/routes";
import { reportsRoutes } from "@/features/reports/routes";
import { schedulingRoutes } from "@/features/scheduling/routes";
import { settingsRoutes } from "@/features/settings/routes";
import { usersRoutes } from "@/features/users/routes";

export const appRoutes = [
  ...dashboardRoutes,
  ...usersRoutes,
  ...academicsRoutes,
  ...attendanceRoutes,
  ...schedulingRoutes,
  ...reportsRoutes,
  ...communicationsRoutes,
  ...financeRoutes,
  ...settingsRoutes,
  ...profileRoutes,
] satisfies RouteObject[];