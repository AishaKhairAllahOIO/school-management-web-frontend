import { dashboardRoutes } from "@/features/dashboard/routes";
import { usersRoutes } from "@/features/users/routes";
import { academicsRoutes } from "@/features/academics/routes";
import { attendanceRoutes } from "@/features/attendance/routes";
import { schedulingRoutes } from  "@/features/scheduling/routes";
import { reportsRoutes } from "@/features/reports/routes";
import { financeRoutes } from "@/features/finance/routes";
import { settingsRoutes } from "@/features/settings/routes";
import { profileRoutes } from "@/features/profile/routes";
import { communicationsRoutes } from "@/features/communications/routes";

export const appRoutes = [
  ...dashboardRoutes,
  usersRoutes,
  academicsRoutes,
  attendanceRoutes,
  schedulingRoutes,
  reportsRoutes,
  communicationsRoutes,
  financeRoutes,
  settingsRoutes,
  profileRoutes,
];